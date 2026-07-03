export type BookStatus = "판매 중" | "절판";

export interface BookLinks {
  kyobo?: string;
  yes24?: string;
  aladin?: string;
  /** 네이버 도서(구매 및 상세 정보) 링크 */
  naver?: string;
  /** 자료 다운로드(예제 파일 등) 링크 */
  resources?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  category: string;
  coverUrl?: string;
  description: string;
  /** YYYY-MM 형식 */
  publishedAt: string;
  status: BookStatus;
  links: BookLinks;
  isbn?: string;
  /** 예: "290쪽" */
  pageCount?: string;
  /** 예: "21,000원" */
  price?: string;
  featured?: boolean;
  /** 신간안내 구글 문서 URL — 설명 본문 소스 */
  docUrl?: string;
  createdAt?: number;
}

export type BookInput = Omit<Book, "id">;
