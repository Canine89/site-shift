import type { Metadata } from "next";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "출판사 소개",
  description:
    "도서출판 시프트는 거짓과 과장이 없는 솔직한 책, 체계적으로 정리된 실용적인 책을 만듭니다.",
};

const HISTORY = [
  {
    date: "2024",
    title: "도서출판 시프트 시작",
    description: "\u201c또 다른 나, 더 나은 나\u201d를 향한 첫걸음을 내디뎠습니다.",
  },
  {
    date: "2024.10",
    title: "캡컷 도서 1위 베스트셀러",
    description:
      "IT·컴퓨터 분야 베스트셀러, 교보문고 분야 종합 2위에 올랐습니다.",
  },
  {
    date: "2025.03",
    title: "첫 예술 분야 출간",
    description: "교보문고 예술 분야 베스트셀러에 올랐습니다.",
  },
  {
    date: "2025.05",
    title: "출간 분야 확장",
    description:
      "IT를 넘어 디자인, 예술까지 — 독자의 Shift가 필요한 모든 곳으로 영역을 넓혀 가고 있습니다.",
  },
];

const VALUES = [
  {
    label: "HONESTY",
    title: "거짓과 과장이 없는 책",
    description:
      "올바른 지식과 정보를 알려 주는 솔직한 책을 만듭니다. 표지의 약속과 본문의 내용이 다르지 않도록, 문장 하나까지 검증합니다.",
  },
  {
    label: "STRUCTURE",
    title: "체계적으로 정리된 책",
    description:
      "넘쳐 나는 정보 속에서 꼭 필요한 것만 골라 실용적인 순서로 배열합니다. 독자가 길을 잃지 않는 구성이 시프트의 편집 원칙입니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-10 pb-4">
      {/* 브랜드 메시지 */}
      <div className="mx-auto max-w-(--page-max-width) px-4 sm:px-6 mb-12">
        <span className="eyebrow text-steel">ABOUT US</span>
        <h1 className="type-display text-paper mt-3">
          또 다른 나,
          <br />더 나은 나를 발견하는 시간
        </h1>
        <p className="text-body text-steel mt-6 max-w-[560px]">
          여러분의 변화를 도서출판 시프트가 함께 하겠습니다. 조용하지만
          분명하게 — 독자의 일상과 실무 스킬을 한 단계 업그레이드하는 책을
          만듭니다.
        </p>
      </div>

      {/* 가치 — Feature split panels */}
      {VALUES.map((value, i) => (
        <Section key={value.label}>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="flex flex-col gap-4">
              <span className="eyebrow text-steel">{value.label}</span>
              <h2 className="type-heading text-paper">{value.title}</h2>
              <p className="text-body text-ash leading-relaxed">
                {value.description}
              </p>
            </div>
            <div className="aspect-square max-w-[380px] w-full mx-auto rounded-tile bg-carbon flex items-center justify-center">
              {i === 0 ? (
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  stroke="#dbe4eb"
                  strokeWidth="1"
                  className="w-2/3 h-2/3"
                  aria-hidden
                >
                  <rect x="30" y="20" width="60" height="80" rx="3" />
                  <path d="M40 34 H80 M40 44 H80 M40 54 H68" />
                  <path d="M40 70 L52 82 L82 52" strokeWidth="1.5" />
                  <circle cx="24" cy="30" r="1" fill="#ffffff" stroke="none" />
                  <circle cx="98" cy="26" r="1" fill="#ffffff" stroke="none" />
                  <circle cx="102" cy="88" r="1" fill="#ffffff" stroke="none" />
                  <circle cx="18" cy="92" r="1" fill="#ffffff" stroke="none" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  stroke="#dbe4eb"
                  strokeWidth="1"
                  className="w-2/3 h-2/3"
                  aria-hidden
                >
                  <path d="M60 12 L104 34 L60 56 L16 34 Z" />
                  <path d="M16 56 L60 78 L104 56" opacity="0.55" />
                  <path d="M16 78 L60 100 L104 78" opacity="0.55" />
                  <circle cx="60" cy="34" r="1.2" fill="#ffffff" stroke="none" />
                  <circle cx="30" cy="66" r="1" fill="#ffffff" stroke="none" />
                  <circle cx="92" cy="88" r="1" fill="#ffffff" stroke="none" />
                </svg>
              )}
            </div>
          </div>
        </Section>
      ))}

      {/* History 타임라인 */}
      <Section eyebrow="HISTORY" title="시프트의 걸음">
        <ol className="flex flex-col">
          {HISTORY.map((item, i) => (
            <li
              key={item.date}
              className={`grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-4 py-6 ${
                i < HISTORY.length - 1 ? "border-b border-carbon" : ""
              }`}
            >
              <span className="eyebrow text-paper pt-1">{item.date}</span>
              <div>
                <h3 className="text-body font-bold text-paper">
                  {item.title}
                </h3>
                <p className="text-body-sm text-steel mt-1">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-body-sm text-steel mt-8">
          비어 있는 히스토리는 앞으로 여러분과 함께 채워 갑니다.
        </p>
      </Section>

      {/* 연락처 & 집필 제안 */}
      <Section surface>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <span className="eyebrow text-steel">CONNECT WITH US</span>
            <h2 className="type-heading text-paper">
              시프트와 함께 변화해 나갈
              <br />
              여러분을 기다립니다
            </h2>
            <p className="text-body text-ash">
              아이디어나 원고가 있다면 지금 바로 제안해 주세요. 오탈자 제보와
              문의도 언제든 환영합니다.
            </p>
            <a
              href="mailto:ask@shiftbook.co.kr?subject=%5B%EC%A7%91%ED%95%84%20%EC%A0%9C%EC%95%88%5D"
              className="btn-pill w-fit mt-2"
            >
              집필 제안하기
            </a>
          </div>

          <dl className="flex flex-col gap-4 md:pl-10 md:border-l md:border-graphite">
            <div>
              <dt className="eyebrow text-steel mb-1">EMAIL</dt>
              <dd className="text-body text-paper">ask@shiftbook.co.kr</dd>
            </div>
            <div>
              <dt className="eyebrow text-steel mb-1">PHONE</dt>
              <dd className="text-body text-paper">010-5855-5587</dd>
            </div>
            <div>
              <dt className="eyebrow text-steel mb-1">SNS</dt>
              <dd className="flex flex-col gap-1">
                <a
                  href="https://www.instagram.com/shift.book/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-ash hover:text-paper"
                >
                  instagram.com/shift.book
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61556354975697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-ash hover:text-paper"
                >
                  facebook — 도서출판 시프트
                </a>
                <a
                  href="https://blog.naver.com/scsvz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-ash hover:text-paper"
                >
                  blog.naver.com/scsvz
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Section>
    </div>
  );
}
