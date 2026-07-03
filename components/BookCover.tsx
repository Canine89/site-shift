/* eslint-disable @next/next/no-img-element */
import type { Book } from "@/lib/types";

type BookCoverProps = {
  book: Pick<Book, "title" | "coverUrl" | "category">;
  className?: string;
};

/**
 * 도서 표지. coverUrl이 없으면 흑백 라인아트 플레이스홀더를 렌더링한다.
 * (1px 스트로크 + 스티플 파티클, 채움 없음)
 */
export default function BookCover({ book, className = "" }: BookCoverProps) {
  if (book.coverUrl) {
    return (
      <div className={`relative overflow-hidden bg-carbon ${className}`}>
        {/* 원본 판형 비율 그대로 표시 (크롭 없음) */}
        <img
          src={book.coverUrl}
          alt={`${book.title} 표지`}
          className="block w-full h-auto"
        />
        {/* 책등 쪽 음영 — 실물 책 느낌 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[6px] bg-gradient-to-r from-black/35 to-transparent"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-3/4 overflow-hidden bg-carbon frame-box flex flex-col items-center justify-center gap-4 p-6 ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        className="w-16 h-16 text-steel"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
      >
        {/* 라인아트 아이소메트릭 책 */}
        <path d="M14 24 L40 12 L66 24 L66 56 L40 68 L14 56 Z" />
        <path d="M40 12 L40 68" />
        <path d="M14 24 L40 36 L66 24" />
        <path d="M20 30 L34 37" opacity="0.5" />
        <path d="M46 37 L60 30" opacity="0.5" />
        {/* 스티플 파티클 */}
        <circle cx="24" cy="18" r="0.8" fill="#ffffff" stroke="none" />
        <circle cx="58" cy="16" r="0.8" fill="#ffffff" stroke="none" />
        <circle cx="70" cy="40" r="0.8" fill="#ffffff" stroke="none" />
        <circle cx="10" cy="44" r="0.8" fill="#ffffff" stroke="none" />
      </svg>
      <div className="text-center">
        <p className="eyebrow text-steel mb-2">{book.category}</p>
        <p className="text-body-sm font-medium text-paper leading-snug line-clamp-3">
          {book.title}
        </p>
      </div>
    </div>
  );
}
