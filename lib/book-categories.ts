/** 시트 CATEGORY 열 — 쉼표 구분 */
export function parseSheetCategories(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function resolveBookCategories(
  sheetRaw: string,
  fallback?: string
): string[] {
  const fromSheet = parseSheetCategories(sheetRaw);
  if (fromSheet.length > 0) return fromSheet;
  if (fallback?.trim()) return [fallback.trim()];
  return ["기타"];
}

export function primaryCategory(categories: string[]): string {
  return categories[0] ?? "기타";
}

export function collectCatalogCategories(books: { categories: string[] }[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const book of books) {
    for (const category of book.categories) {
      if (seen.has(category)) continue;
      seen.add(category);
      ordered.push(category);
    }
  }
  return ordered;
}

export function bookMatchesCategory(
  book: { categories: string[] },
  category: string
): boolean {
  return book.categories.includes(category);
}
