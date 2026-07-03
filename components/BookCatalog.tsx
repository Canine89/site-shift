"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/BookCard";
import type { Book } from "@/lib/types";

export default function BookCatalog({ books }: { books: Book[] }) {
  const categories = useMemo(
    () => ["전체", ...Array.from(new Set(books.map((b) => b.category)))],
    [books]
  );
  const [active, setActive] = useState("전체");

  const filtered =
    active === "전체" ? books : books.filter((b) => b.category === active);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`eyebrow rounded-pill border px-4 py-1.5 transition-colors cursor-pointer ${
              active === category
                ? "border-solid border-paper text-void bg-paper"
                : "border-graphite text-steel hover:border-paper hover:text-paper"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-body text-steel py-10 text-center">
          해당 분야의 도서가 아직 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
