import type { Metadata } from "next";
import Section from "@/components/Section";
import {
  AUTHOR_PROPOSAL_EMAIL_NOTE_LINES,
  AUTHOR_PROPOSAL_FORM_URL,
  AUTHOR_PROPOSAL_LINES,
  BLOG_URL,
  COMPANY_PHONE,
  CONTACT_EMAIL,
  OFFER_EMAIL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "출판사 소개",
  description:
    "도서출판 시프트는 거짓과 과장이 없는 솔직한 책, 체계적으로 정리된 실용적인 책을 만듭니다.",
};

const PRINCIPLES = [
  {
    title: "거짓과 과장이 없는 책",
    description:
      "독자의 눈길을 끌기 위한 과장보다 독자에게 실제 도움이 되는 내용을 담겠습니다. 충분한 검토와 검증을 거친 정보, 경험과 근거를 바탕으로 한 이야기를 통해 오래도록 신뢰받는 책을 만들겠습니다.",
  },
  {
    title: "체계적으로 정리된 책",
    description:
      "내용을 쉽고 명확하게 전달하는 것도 좋은 책의 요건입니다. 시프트는 흐름을 따라 자연스럽게 이해할 수 있는 구성과 실용적인 예시를 담아 누구나 끝까지 읽을 수 있고, 바로 적용할 수 있는 책을 만들겠습니다.",
  },
];

const HISTORY = [
  {
    date: "2024",
    title: "도서출판 시프트 시작",
    description: "\u201c또 다른 나, 더 나은 나\u201d를 향한 첫걸음을 내디뎠습니다.",
  },
  {
    date: "2024.10",
    title: "첫 책 출간",
    description:
      "시프트의 첫 책, [20가지 템플릿으로 배우는 노션 Notion]을 출간했습니다.",
  },
  {
    date: "2025.03",
    title: "캡컷 도서 1위 베스트셀러",
    description:
      "IT·컴퓨터 분야 베스트셀러, 교보문고 분야 종합 2위에 올랐습니다.",
  },
  {
    date: "2025.05",
    title: "‘디자인 읽기’ 시리즈 출간",
    description:
      "디자이너의 읽을 거리, ‘디자인 읽기’ 시리즈 출간을 시작하였습니다.",
  },
  {
    date: "2025.11",
    title: "세종 도서 선정",
    description:
      "시프트 출판사의 세 번째 출간 도서가 2025 세종도서 교양 부문에 선정되었습니다.",
  },
  {
    date: "2026.10",
    title: "취미 실용 도서 출간",
    description: "AI로 편리해진 일상, 새로운 취미의 시작을 돕습니다.",
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
        <div className="flex flex-col gap-4 text-body text-steel mt-6 max-w-[640px] text-pretty">
          <p>한 권의 책은 새로운 지식을 넘어 새로운 관점을 선물합니다.</p>
          <p>
            시프트는 업무와 일상에 작은 변화를 더하고, 오늘보다 한 걸음 성장한
            내일을 만날 수 있는 책을 만듭니다. 독자의 가능성을 넓히고 더 나은
            나를 발견하는 여정, 시프트가 함께하겠습니다.
          </p>
        </div>
      </div>

      {/* 만드는 책의 원칙 */}
      <Section eyebrow="OUR BOOKS" title="시프트가 만드는 책">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <h3 className="type-heading text-paper text-subheading">
                {item.title}
              </h3>
              <p className="text-body text-steel leading-relaxed text-pretty">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

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
            <span className="eyebrow text-steel">WRITE WITH US</span>
            <h2 className="type-heading text-paper text-balance">
              시프트와 함께 변화를 만들어갈 여러분을 기다립니다
            </h2>
            <div className="flex flex-col gap-2 text-body text-ash leading-relaxed text-pretty">
              {AUTHOR_PROPOSAL_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <a
              href={AUTHOR_PROPOSAL_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill w-fit mt-2"
            >
              집필 계획서 작성
            </a>
            <div className="flex flex-col gap-1.5 text-body-sm text-graphite text-pretty">
              {AUTHOR_PROPOSAL_EMAIL_NOTE_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a
                href={`mailto:${OFFER_EMAIL}`}
                className="text-steel hover:text-paper underline underline-offset-4 w-fit"
              >
                {OFFER_EMAIL}
              </a>
            </div>
          </div>

          <dl className="flex flex-col gap-4 md:pl-10 md:border-l md:border-graphite">
            <div>
              <dt className="eyebrow text-steel mb-1">집필 제안</dt>
              <dd className="text-body text-paper">{OFFER_EMAIL}</dd>
            </div>
            <div>
              <dt className="eyebrow text-steel mb-1">문의 · 오탈자</dt>
              <dd className="text-body text-paper">{CONTACT_EMAIL}</dd>
            </div>
            <div>
              <dt className="eyebrow text-steel mb-1">PHONE</dt>
              <dd className="text-body text-paper">{COMPANY_PHONE}</dd>
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
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-ash hover:text-paper"
                >
                  shiftbook.notion.site
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Section>
    </div>
  );
}
