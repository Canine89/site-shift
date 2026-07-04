"use client";

import { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";
import {
  bookMatchesCategory,
  collectCatalogCategories,
} from "@/lib/book-categories";
import type { Book } from "@/lib/types";

type BookCatalogProps = {
  books: Book[];
};

function BookCatalogInner({ books }: BookCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = useMemo(
    () => ["전체", ...collectCatalogCategories(books)],
    [books]
  );

  const categoryFromUrl = searchParams.get("category");
  const active =
    categoryFromUrl && categories.includes(categoryFromUrl)
      ? categoryFromUrl
      : "전체";

  const selectCategory = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "전체") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const filtered =
    active === "전체"
      ? books
      : books.filter((book) => bookMatchesCategory(book, active));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <span className="eyebrow text-steel">분야</span>
            <p className="text-body-sm text-graphite mt-1">
              {active === "전체"
                ? `전체 ${books.length}권`
                : `${active} · ${filtered.length}권`}
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="분야 필터"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={active === category}
              onClick={() => selectCategory(category)}
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

export default function BookCatalog({ books }: BookCatalogProps) {
  return <BookCatalogInner books={books} />;
}
