import Link from "next/link";
import Image from "next/image";
import ThemePicker from "@/components/ThemePicker";
import { BLOG_URL, COMPANY_ADDRESS, ERRATA_FORM_URL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="mx-auto max-w-(--page-max-width) px-4 sm:px-6 pb-10">
        <div className="frame-box rounded-tile p-6 sm:p-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
            <div className="flex flex-col gap-3">
              <Image
                src="/shift-logo-white.png"
                alt="시프트"
                width={86}
                height={25}
              />
              <p className="text-body-sm text-steel max-w-xs">
                새로운 모습, 새로운 능력을 발견하는 데<br />도움이 되는 책을
                만듭니다.
              </p>
            </div>

            <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                <span className="eyebrow text-steel">SITEMAP</span>
                <Link
                  href="/books"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  출간 도서
                </Link>
                <Link
                  href="/about"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  출판사 소개
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="eyebrow text-steel">CONNECT</span>
                <a
                  href="https://www.instagram.com/shift.book/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61556354975697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  Facebook
                </a>
                <a
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  Blog
                </a>
                <a
                  href={ERRATA_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  오탈자 제보
                </a>
                <a
                  href="mailto:ask@shiftbook.co.kr"
                  className="text-body-sm text-ash hover:text-paper"
                >
                  ask@shiftbook.co.kr
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-carbon pt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-caption text-steel leading-relaxed">
                상호명 시프트 · 사업자 등록번호 632-99-01606 · 발행인 송찬수 ·
                문의 ask@shiftbook.co.kr
              </p>
              <p className="text-caption text-steel leading-relaxed mt-1">
                {COMPANY_ADDRESS}
              </p>
              <p className="text-caption text-graphite mt-1">
                © 2026 shift. All rights reserved.
              </p>
            </div>
            <ThemePicker />
          </div>
        </div>
      </div>
    </footer>
  );
}
