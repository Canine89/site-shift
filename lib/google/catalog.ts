import type { Book, BookStatus } from "@/lib/types";
import { parseSheetCategories, primaryCategory } from "@/lib/book-categories";
import { parseSheetStatus } from "@/lib/book-status";
import { parseCsv, rowsToObjects } from "@/lib/google/csv";
import { buildBookFromDoc } from "@/lib/google/doc";
import { OUT_OF_PRINT_SLUGS, slugForTitle } from "@/lib/google/slugs";

const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ??
  "1VfrDce-7N-KJ1UpXP57MtR-T1Bl2gRCa5yBmkk2TD1E";
const SHEET_GID = process.env.GOOGLE_SHEET_GID ?? "0";

export type SheetEntry = {
  id: string;
  title: string;
  docUrl: string;
  status: BookStatus;
  featured: boolean;
  categories: string[];
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
  const statusRaw = pick(row, "STATUS", "status", "상태");
  const statusFallback: BookStatus = OUT_OF_PRINT_SLUGS.has(id)
    ? "절판"
    : "판매 중";
  const status = parseSheetStatus(statusRaw, statusFallback);

  return {
    id,
    title,
    docUrl,
    status,
    featured: parseBool(pick(row, "BEST", "best")),
    categories: parseSheetCategories(pick(row, "CATEGORY", "category", "카테고리")),
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
      const categories =
        entry.categories.length > 0
          ? entry.categories
          : partial.category
            ? [partial.category]
            : ["기타"];
      return {
        ...(partial as Book),
        categories,
        category: primaryCategory(categories),
      };
    })
  );

  return books.filter((b) => b.title && b.docUrl);
}
