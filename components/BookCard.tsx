import Link from "next/link";
import BookCover from "@/components/BookCover";
import StatusBadge from "@/components/StatusBadge";
import type { Book } from "@/lib/types";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex flex-col gap-4 rounded-tile p-4 -m-4 transition-colors hover:bg-carbon"
    >
      <BookCover book={book} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="eyebrow text-steel">{book.category}</span>
          <StatusBadge status={book.status} />
        </div>
        <h3 className="text-body font-bold text-paper leading-snug group-hover:underline underline-offset-4">
          {book.title}
        </h3>
        <p className="text-body-sm text-steel">
          {book.author} · {book.publishedAt}
        </p>
      </div>
    </Link>
  );
}
