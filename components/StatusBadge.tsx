import type { BookStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  BookStatus,
  { border: string; dot: string }
> = {
  "판매 중": {
    border: "border-paper text-paper",
    dot: "bg-paper",
  },
  "출간 예정": {
    border: "border-steel text-steel",
    dot: "bg-steel",
  },
  절판: {
    border: "border-graphite text-graphite",
    dot: "bg-graphite",
  },
};

export default function StatusBadge({ status }: { status: BookStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`eyebrow inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 ${style.border}`}
    >
      <span
        className={`inline-block w-1 h-1 rounded-full ${style.dot}`}
        aria-hidden
      />
      {status}
    </span>
  );
}
