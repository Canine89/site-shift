/** 시트 TITLE → 사이트 URL 슬러그 (표지 경로와 동일) */
export const TITLE_SLUGS: Record<string, string> = {
  "브랜드가 된 디자이너": "designer-as-brand",
  "챗GPT·제미나이·클로드까지 모두를 위한 AI": "ai-for-everyone",
  "취미가 돈이 되는 인스타툰": "instatoon",
  "요즘 직장인을 위한 실무 보고서 작성 비법": "business-report",
  "광고, UX/UI, 브랜딩에 바로 쓰는 디자인 심리 108":
    "design-psychology-108",
  "모두를 위한 다이소 드로잉": "daiso-drawing",
  "누구나 쉽게 AI 작사 & 작곡 with 생성형 인공지능, 챗GPT, 수노, 유디오":
    "ai-music",
  "사수 없는 디자이너의 나 홀로 성장하기": "solo-growth-designer",
  "요즘 디자인을 위한 포토샵 & 일러스트레이터":
    "photoshop-illustrator",
  "디자인 감각 제대로 키우는 법": "design-sense",
  "마법 같은 영상 제작을 위한 스마트폰 촬영 및 편집 with 캡컷":
    "capcut-video",
  "인공지능이 다 해주는 브루 영상 편집": "vrew-video-editing",
  "20가지 템플릿으로 배우는 노션 Notion": "notion-templates",
};

export const OUT_OF_PRINT_SLUGS = new Set(["notion-templates"]);

export function slugForTitle(title: string): string {
  const normalized = title.trim().replace(/^\[best\]\s*/i, "");
  if (TITLE_SLUGS[normalized]) return TITLE_SLUGS[normalized];
  return normalized
    .toLowerCase()
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
