import type { Book, BookStatus } from "@/lib/types";
import { parseCsv, rowsToObjects } from "@/lib/google/csv";
import { buildBookFromDoc } from "@/lib/google/doc";
import {
  OUT_OF_PRINT_SLUGS,
  slugForTitle,
} from "@/lib/google/slugs";

const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ??
  "1dXiO7FUEbOzkMEDkJVeDHdVC6XKen7gv8Y6tXQve3Mk";
const SHEET_GID = process.env.GOOGLE_SHEET_GID ?? "0";

export type SheetEntry = {
  id: string;
  title: string;
  docUrl: string;
  status: BookStatus;
  featured: boolean;
};

function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    const exact = row[key];
    if (exact?.trim()) return exact.trim();
    const lower = row[key.toLowerCase()];
    if (lower?.trim()) return lower.trim();
  }
  return "";
}

function parseBool(value: string): boolean {
  switch (value.trim().toLowerCase()) {
    case "true":
    case "1":
    case "yes":
    case "y":
      return true;
    default:
      return false;
  }
}

function rowToEntry(row: Record<string, string>): SheetEntry | null {
  const title = pick(row, "TITLE", "title", "제목");
  const docUrl = pick(row, "URL", "url", "docUrl", "DOC_URL");
  if (!title || !docUrl) return null;

  const id = pick(row, "id", "ID") || slugForTitle(title);
  const status: BookStatus =
    pick(row, "status", "STATUS") === "절판" || OUT_OF_PRINT_SLUGS.has(id)
      ? "절판"
      : "판매 중";

  return {
    id,
    title,
    docUrl,
    status,
    featured: parseBool(pick(row, "BEST", "best")),
  };
}

async function fetchSheetCsv(): Promise<string | null> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.trim() || text.trim().split("\n").length < 2) return null;
    return text;
  } catch {
    return null;
  }
}

export async function loadSheetEntries(): Promise<SheetEntry[]> {
  const csv = await fetchSheetCsv();
  if (!csv) return [];

  const rows = rowsToObjects(parseCsv(csv.replace(/^\uFEFF/, "")));
  return rows.map(rowToEntry).filter((e): e is SheetEntry => e != null);
}

/** 시트 TITLE·URL + 구글 독스 본문으로 Book 목록 생성 */
export async function loadBooksFromSheet(): Promise<Book[]> {
  const entries = await loadSheetEntries();
  if (!entries.length) return [];

  const books = await Promise.all(
    entries.map(async (entry) => {
      const partial = await buildBookFromDoc(
        entry.title,
        entry.docUrl,
        entry.id,
        entry.status,
        entry.featured
      );
      return partial as Book;
    })
  );

  return books.filter((b) => b.title && b.docUrl);
}
