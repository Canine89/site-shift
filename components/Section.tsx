import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Elevated Carbon surface instead of transparent Void */
  surface?: boolean;
  className?: string;
  eyebrow?: string;
  title?: string;
  center?: boolean;
};

/**
 * Section Container — a quiet hairline frame around each content block.
 */
export default function Section({
  children,
  surface = false,
  className = "",
  eyebrow,
  title,
  center = false,
}: SectionProps) {
  return (
    <section className="mx-auto max-w-(--page-max-width) px-4 sm:px-6 mt-20 first:mt-0">
      <div
        className={`frame-box rounded-tile p-6 sm:p-12 ${
          surface ? "bg-carbon" : ""
        } ${className}`}
      >
        {(eyebrow || title) && (
          <div
            className={`mb-10 flex flex-col gap-3 ${
              center ? "items-center text-center" : ""
            }`}
          >
            {eyebrow && (
              <span className="eyebrow text-steel">{eyebrow}</span>
            )}
            {title && <h2 className="type-heading text-paper">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
