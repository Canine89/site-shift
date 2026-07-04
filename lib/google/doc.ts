import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Book, BookStatus } from "@/lib/types";

const DOC_ID_RE = /\/document\/d\/([\w-]+)/;

/**
 * 표지 경로 결정: 큐레이션된 로컬 파일(public/covers/{id}.jpg)이 있으면 우선,
 * 없으면 구글 문서에서 표지를 추출하는 라우트를 사용한다.
 */
function resolveCoverUrl(id: string, docUrl: string): string {
  if (existsSync(join(process.cwd(), "public", "covers", `${id}.jpg`))) {
    return `/covers/${id}.jpg`;
  }
  const docId = extractGoogleDocId(docUrl);
  if (docId) return `/api/book-cover/${docId}`;
  return `/covers/${id}.jpg`;
}

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

function imageDimensions(
  contentType: string,
  data: Buffer
): { width: number; height: number } | null {
  if (contentType === "image/png") {
    if (data.length < 24) return null;
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }
  if (contentType === "image/jpeg") {
    let i = 2;
    while (i < data.length) {
      if (data[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = data[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: data.readUInt16BE(i + 5),
          width: data.readUInt16BE(i + 7),
        };
      }
      i += 2 + data.readUInt16BE(i + 2);
    }
  }
  return null;
}

export type DocCover = { data: Buffer; contentType: string };

/**
 * 구글 문서 HTML export에 base64로 내장된 이미지 중 표지를 고른다.
 * 표지는 세로형(3:4)이므로 세로 비율 이미지 중 가장 큰 것을 선택하고,
 * 세로형이 없으면 면적이 가장 큰 이미지를 사용한다.
 */
export async function extractDocCover(docId: string): Promise<DocCover | null> {
  const res = await fetch(
    `https://docs.google.com/document/d/${docId}/export?format=html`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const html = await res.text();

  const re = /src="data:(image\/[a-z]+);base64,([^"]+)"/g;
  const images: {
    contentType: string;
    data: Buffer;
    width: number;
    height: number;
  }[] = [];

  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const contentType = m[1];
    const data = Buffer.from(m[2], "base64");
    const dim = imageDimensions(contentType, data);
    if (!dim || dim.width === 0 || dim.height === 0) continue;
    images.push({ contentType, data, ...dim });
  }
  if (!images.length) return null;

  const portrait = images.filter((img) => img.height > img.width * 1.1);
  const pool = portrait.length ? portrait : images;
  pool.sort((a, b) => b.width * b.height - a.width * a.height);

  const best = pool[0];
  return { data: best.data, contentType: best.contentType };
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
      coverUrl: resolveCoverUrl(id, docUrl),
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
    coverUrl: resolveCoverUrl(id, docUrl),
    featured,
  };
}
