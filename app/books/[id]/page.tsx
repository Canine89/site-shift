import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/Section";
import BookCover from "@/components/BookCover";
import StatusBadge from "@/components/StatusBadge";
import { getBook } from "@/lib/books-data";
import { isBookAvailable } from "@/lib/book-status";
import { ERRATA_FORM_URL } from "@/lib/site";

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) return { title: "도서를 찾을 수 없습니다" };
  return {
    title: book.title,
    description: book.description.slice(0, 120),
  };
}

const STORE_LABELS: Record<string, string> = {
  kyobo: "교보문고",
  yes24: "YES24",
  aladin: "알라딘",
  naver: "네이버 도서",
};

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const storeLinks = Object.entries(book.links ?? {}).filter(
    ([key, url]) => key !== "resources" && url
  );

  return (
    <div className="pt-10 pb-4">
      <div className="mx-auto max-w-(--page-max-width) px-4 sm:px-6 mb-8">
        <Link href="/books" className="btn-ghost -ml-3">
          ← 전체 도서
        </Link>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,340px)_1fr] gap-10 md:gap-16">
          <BookCover book={book} className="max-w-[340px] self-start" />

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="eyebrow text-steel">
                {book.categories.join(" · ")}
              </span>
              <StatusBadge status={book.status} />
            </div>

            <div>
              <h1 className="type-heading text-paper sm:text-[40px] sm:leading-[1.15]">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-subheading text-ash mt-2">
                  {book.subtitle}
                </p>
              )}
            </div>

            <dl className="flex flex-col gap-2 border-t border-carbon pt-5">
              <div className="flex gap-4">
                <dt className="eyebrow text-steel w-20 shrink-0 pt-0.5">
                  저자
                </dt>
                <dd className="text-body-sm text-paper">{book.author}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="eyebrow text-steel w-20 shrink-0 pt-0.5">
                  출간
                </dt>
                <dd className="text-body-sm text-paper">{book.publishedAt}</dd>
              </div>
              {book.pageCount && (
                <div className="flex gap-4">
                  <dt className="eyebrow text-steel w-20 shrink-0 pt-0.5">
                    페이지
                  </dt>
                  <dd className="text-body-sm text-paper">{book.pageCount}</dd>
                </div>
              )}
              {book.price && (
                <div className="flex gap-4">
                  <dt className="eyebrow text-steel w-20 shrink-0 pt-0.5">
                    정가
                  </dt>
                  <dd className="text-body-sm text-paper">{book.price}</dd>
                </div>
              )}
              {book.isbn && (
                <div className="flex gap-4">
                  <dt className="eyebrow text-steel w-20 shrink-0 pt-0.5">
                    ISBN
                  </dt>
                  <dd className="text-body-sm text-paper">{book.isbn}</dd>
                </div>
              )}
            </dl>

            <p className="text-body text-ash leading-relaxed whitespace-pre-line">
              {book.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {isBookAvailable(book.status) && storeLinks.length > 0 ? (
                storeLinks.map(([store, url]) => (
                  <a
                    key={store}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill"
                  >
                    {STORE_LABELS[store] ?? store}에서 구매
                  </a>
                ))
              ) : book.status === "판매 중" ? (
                <p className="text-body-sm text-steel">
                  온라인 서점에서 &ldquo;{book.title}&rdquo;을 검색해 보세요.
                </p>
              ) : book.status === "출간 예정" ? (
                <p className="text-body-sm text-steel">
                  출간을 준비 중입니다. 곧 만나뵙겠습니다.
                </p>
              ) : null}
              {book.links?.resources && (
                <a
                  href={book.links.resources}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  자료 다운로드 ↓
                </a>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section surface center>
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <p className="text-body text-steel">
            오탈자를 발견하셨나요? 더 나은 책을 만드는 데 큰 도움이 됩니다.
          </p>
          <a
            href={ERRATA_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
          >
            오탈자 제보하기
          </a>
        </div>
      </Section>
    </div>
  );
}
