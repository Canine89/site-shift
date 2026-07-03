import Link from "next/link";
import Image from "next/image";
import Section from "@/components/Section";
import HeroTitleLottie from "@/components/HeroTitleLottie";
import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/books-data";

export const revalidate = 60;

export default async function HomePage() {
  const books = await getBooks();
  const featured = books.filter((b) => b.featured).slice(0, 3);
  const showcase = featured.length > 0 ? featured : books.slice(0, 3);

  return (
    <div className="pb-4">
      {/* Hero Spotlight */}
      <section className="hero-wash -mt-16 pt-16">
        <div className="mx-auto max-w-(--page-max-width) px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-6 py-24 sm:py-36 max-w-[720px] mx-auto">
            <Image
              src="/shift-logo-white.png"
              alt="시프트"
              width={164}
              height={48}
              priority
              className="hero-rise mb-2"
            />
            <HeroTitleLottie />
            <p
              className="text-body text-steel max-w-[520px] hero-rise"
              style={{ "--rise-delay": "0.45s" } as React.CSSProperties}
            >
              여러분의 변화를 도서출판 시프트가 함께 하겠습니다.<br />독자의 일상과
              실무 스킬을 한 단계 업그레이드하는 책을 만듭니다.
            </p>
            <div
              className="flex items-center gap-3 hero-rise"
              style={{ "--rise-delay": "0.6s" } as React.CSSProperties}
            >
              <Link href="/books" className="btn-pill">
                출간 도서 보기
              </Link>
              <Link href="/about" className="btn-ghost">
                출판사 소개 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 대표 도서 */}
      <Section eyebrow="best seller" title="시프트의 베스트 셀러">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcase.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/books" className="btn-pill">
            전체 카탈로그 보기
          </Link>
        </div>
      </Section>

      {/* 집필 제안 CTA */}
      <Section surface center>
        <div className="flex flex-col items-center text-center gap-5 py-6">
          <span className="eyebrow text-steel">WRITE WITH US</span>
          <h2 className="type-heading text-paper">
            당신의 지식이 누군가의 Shift가 됩니다
          </h2>
          <p className="text-body text-steel max-w-[520px]">
            아이디어나 원고가 있다면 지금 바로 제안해 주세요.<br />시프트와 함께
            변화해 나갈 저자를 기다립니다.
          </p>
          <a href="mailto:ask@shiftbook.co.kr" className="btn-pill">
            집필 제안하기
          </a>
        </div>
      </Section>
    </div>
  );
}
