import type { Metadata } from "next";
import Section from "@/components/Section";
import BookCatalog from "@/components/BookCatalog";
import { getBooks } from "@/lib/books-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "출간 도서",
  description:
    "도서출판 시프트의 출간 도서 카탈로그. IT·컴퓨터, 디자인, 예술 분야의 실용적인 책을 만나 보세요.",
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="pt-10 pb-4">
      <div className="mx-auto max-w-(--page-max-width) px-4 sm:px-6 mb-12">
        <span className="eyebrow text-steel">CATALOG</span>
        <h1 className="type-display text-paper mt-3">출간 도서</h1>
        <p className="text-body text-steel mt-4 max-w-[520px]">
          시프트가 만든 책들입니다.<br />여러분의 일상과 실무를 업그레이드합니다.
        </p>
      </div>

      <Section>
        <BookCatalog books={books} />
      </Section>
    </div>
  );
}
