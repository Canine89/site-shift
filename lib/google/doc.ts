import type { Book, BookStatus } from "@/lib/types";

const DOC_ID_RE = /\/document\/d\/([\w-]+)/;

export function extractGoogleDocId(url: string): string | null {
  const m = url.match(DOC_ID_RE);
  return m?.[1] ?? null;
}

function normalizeText(raw: string): string {
  return raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function parseKoreanDate(value: string): string {
  const m = value.match(/(\d{4})\s*년\s*(\d{1,2})\s*월/);
  if (!m) return "";
  return `${m[1]}-${m[2].padStart(2, "0")}`;
}

function parseBullets(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^[・•]\s*([^:：]+)\s*[:：]\s*(.+)$/);
    if (!m) continue;
    const key = m[1].replace(/\s+/g, "");
    fields[key] = m[2].trim();
  }
  return fields;
}

function parseSubtitle(text: string, sheetTitle: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const titleIdx = lines.findIndex(
    (l) =>
      l.includes(sheetTitle.slice(0, 8)) ||
      sheetTitle.includes(l.replace(/\s+/g, " ").slice(0, 8))
  );
  if (titleIdx >= 0 && lines[titleIdx + 1]) {
    const next = lines[titleIdx + 1];
    if (!next.startsWith("・") && !/^\d+\./.test(next)) return next;
  }
  return "";
}

/** 보도자료 구글 문서에서 '책 소개' 본문 추출 */
export function extractBookIntro(raw: string): string {
  const text = normalizeText(raw);
  const matches = [...text.matchAll(/\d?\.?\s*책 소개/g)];
  if (!matches.length) return "";

  const start = matches[matches.length - 1].index ?? 0;
  let body = text.slice(start).replace(/^\d?\.?\s*책 소개\s*/, "");

  const end = body.match(/\n\s*\d\.\s*(저[^\n]{0,12}소개|출판사 리뷰|목\s*차)/);
  if (end?.index != null) body = body.slice(0, end.index);

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.slice(0, 3).join("\n\n").trim();
}

export type ParsedDocFields = {
  subtitle?: string;
  author: string;
  publishedAt: string;
  pageCount?: string;
  price?: string;
  isbn?: string;
  description: string;
  category: string;
};

export function parseBookFromDoc(
  raw: string,
  sheetTitle: string
): ParsedDocFields {
  const text = normalizeText(raw);
  const bullets = parseBullets(text);
  const description = extractBookIntro(text);
  const subtitle =
    bullets["부제목"] || parseSubtitle(text, sheetTitle) || undefined;

  const author =
    bullets["지은이"] ||
    bullets["지은이/옮긴이"]?.split("/")[0]?.trim() ||
    "시프트 편집부";

  const publishedAt = parseKoreanDate(
    bullets["발행일"] || bullets["출판일"] || ""
  );

  const pageRaw = bullets["페이지"] || "";
  const pageCount = pageRaw ? pageRaw.replace(/(\d+)쪽?/, "$1쪽") : undefined;

  const priceRaw = bullets["정가"] || bullets["가격"] || "";
  const priceMatch = priceRaw.match(/([\d,]+)/);
  const price = priceMatch
    ? `${Number(priceMatch[1].replace(/,/g, "")).toLocaleString("ko-KR")}원`
    : undefined;

  const keywords = bullets["키워드"] || "";
  const category = keywords.split(",")[0]?.trim() || "기타";

  return {
    subtitle,
    author,
    publishedAt,
    pageCount,
    price,
    isbn: bullets["ISBN"],
    description: description || subtitle || sheetTitle,
    category,
  };
}

export async function fetchDocText(docUrl: string): Promise<string> {
  const id = extractGoogleDocId(docUrl);
  if (!id) return "";

  const res = await fetch(
    `https://docs.google.com/document/d/${id}/export?format=txt`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return "";
  return res.text();
}

export async function fetchDocDescription(docUrl: string): Promise<string> {
  const raw = await fetchDocText(docUrl);
  return extractBookIntro(raw);
}

export async function buildBookFromDoc(
  sheetTitle: string,
  docUrl: string,
  id: string,
  status: BookStatus,
  featured: boolean
): Promise<Partial<Book>> {
  const raw = await fetchDocText(docUrl);
  if (!raw) {
    return {
      id,
      title: sheetTitle,
      author: "시프트 편집부",
      category: "기타",
      description: sheetTitle,
      publishedAt: "",
      status,
      links: {},
      docUrl,
      coverUrl: `/covers/${id}.jpg`,
      featured,
    };
  }

  const parsed = parseBookFromDoc(raw, sheetTitle);
  return {
    id,
    title: sheetTitle.replace(/^\[best\]\s*/i, ""),
    subtitle: parsed.subtitle,
    author: parsed.author,
    category: parsed.category,
    description: parsed.description,
    publishedAt: parsed.publishedAt,
    status,
    links: {},
    isbn: parsed.isbn,
    pageCount: parsed.pageCount,
    price: parsed.price,
    docUrl,
    coverUrl: `/covers/${id}.jpg`,
    featured,
  };
}
