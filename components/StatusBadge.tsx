import type { BookStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: BookStatus }) {
  const inPrint = status === "판매 중";
  return (
    <span
      className={`eyebrow inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 ${
        inPrint ? "border-paper text-paper" : "border-graphite text-graphite"
      }`}
    >
      <span
        className={`inline-block w-1 h-1 rounded-full ${
          inPrint ? "bg-paper" : "bg-graphite"
        }`}
      />
      {status}
    </span>
  );
}
