import "server-only";

import { loadBooksFromSheet } from "@/lib/google/catalog";
import { fetchDocText, parseBookFromDoc } from "@/lib/google/doc";
import type { Book } from "@/lib/types";

function sortBooks(books: Book[]): Book[] {
  return [...books].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBooks(): Promise<Book[]> {
  const books = await loadBooksFromSheet();
  return sortBooks(books);
}

export async function getBook(id: string): Promise<Book | null> {
  const books = await getBooks();
  const book = books.find((b) => b.id === id);
  if (!book?.docUrl) return book ?? null;

  // 상세 페이지: 독스 최신 본문 재확인
  const raw = await fetchDocText(book.docUrl);
  if (!raw) return book;

  const parsed = parseBookFromDoc(raw, book.title);
  return {
    ...book,
    ...parsed,
    title: book.title,
    id: book.id,
    docUrl: book.docUrl,
    coverUrl: book.coverUrl,
    status: book.status,
    featured: book.featured,
    links: book.links,
  };
}
