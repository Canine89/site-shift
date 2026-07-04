import type { BookStatus } from "@/lib/types";

export const BOOK_STATUSES: BookStatus[] = ["판매 중", "절판", "출간 예정"];

export function parseSheetStatus(raw: string, fallback: BookStatus = "판매 중"): BookStatus {
  const value = raw.trim();
  if ((BOOK_STATUSES as string[]).includes(value)) {
    return value as BookStatus;
  }
  return fallback;
}

export function isBookAvailable(status: BookStatus): boolean {
  return status === "판매 중";
}
