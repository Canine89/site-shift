#!/usr/bin/env python3
"""Notion 공개 카탈로그(shiftbook.notion.site)에서 도서 데이터를 수집해
data/seed-books.ts 와 public/covers/ 를 생성한다.

사용법: python3 scripts/fetch-notion-books.py
(외부 의존성 없음 — 표준 라이브러리만 사용)
"""

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://shiftbook.notion.site"
SPACE_ID = "02dc95b5-a7a5-4edb-9ac6-c94391ec73f0"
COLLECTION_ID = "5143d4fd-0be2-413c-bc08-832c9e98351d"
VIEW_ID = "d141740b-123e-42d6-aed7-a3ff5f05aa0c"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

# 블록 ID → 사이트에서 쓸 슬러그
SLUGS = {
    "388a0d9f-f46d-8012-a1bd-fd5d40b86500": "designer-as-brand",
    "387a0d9f-f46d-80d9-8ee6-f4ab980a5d61": "ai-for-everyone",
    "367a0d9f-f46d-803f-99ef-fdf5e1a473a6": "instatoon",
    "30da0d9f-f46d-809e-95af-cb4e2e8f2fa9": "business-report",
    "2e0a0d9f-f46d-8056-be6d-e6d53f987a5f": "design-psychology-108",
    "2b1a0d9f-f46d-80df-b0aa-fe0cc5cb0d73": "daiso-drawing",
    "25ba0d9f-f46d-8057-95e8-ffed0c5fd1df": "ai-music",
    "225a0d9f-f46d-80cb-b6cf-d9a474135af1": "solo-growth-designer",
    "1e2a0d9f-f46d-8023-85e2-e5b9793b65a4": "photoshop-illustrator",
    "1a0a0d9f-f46d-800d-a94f-c1badd54f6e1": "design-sense",
    "182a0d9f-f46d-80c8-ab6c-d6e36d676e2a": "capcut-video",
    "ec8e5b39-7980-4c44-bd86-155a0df574d1": "vrew-video-editing",
    "ee634557-68cc-406c-bab4-3e047bc5fdf0": "notion-templates",
}

FEATURED = {"designer-as-brand", "ai-for-everyone", "instatoon"}


def post(path, payload):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "User-Agent": UA},
    )
    with urllib.request.urlopen(req) as res:
        return json.load(res)


def fetch(url):
    # 서명 URL 경로에 한글 파일명이 그대로 들어오므로 퍼센트 인코딩한다
    url = urllib.parse.quote(url, safe=":/?&=%-_.~")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req) as res:
        return res.read()


def plain(prop):
    if not prop:
        return ""
    return "".join(
        x[0] for x in prop if isinstance(x, list) and x and isinstance(x[0], str)
    )


def unwrap(record):
    v = record.get("value", {})
    return v.get("value", v)


def query_collection():
    d = post(
        "/api/v3/queryCollection?src=initial_load",
        {
            "source": {
                "type": "collection",
                "id": COLLECTION_ID,
                "spaceId": SPACE_ID,
            },
            "collectionView": {"id": VIEW_ID, "spaceId": SPACE_ID},
            "loader": {
                "type": "reducer",
                "reducers": {
                    "collection_group_results": {"type": "results", "limit": 200}
                },
                "sort": [],
                "searchQuery": "",
                "userTimeZone": "Asia/Seoul",
            },
        },
    )
    ids = d["result"]["reducerResults"]["collection_group_results"]["blockIds"]
    blocks = d["recordMap"]["block"]
    return ids, blocks


def load_page_table(page_id):
    """도서 페이지의 '기본 정보' 표에서 부제목/지은이 등 필드를 추출한다."""
    d = post(
        "/api/v3/loadCachedPageChunkV2",
        {
            "page": {"id": page_id},
            "limit": 100,
            "cursor": {"stack": []},
            "verticalColumns": False,
        },
    )
    blocks = d["recordMap"].get("block", {})
    info = {}
    for b in blocks.values():
        v = unwrap(b)
        if v.get("type") != "table_row":
            continue
        props = v.get("properties") or {}
        cells = [plain(p) for p in props.values()]
        cells = [c.replace("\xa0", " ").strip() for c in cells if c.strip()]
        if len(cells) >= 2:
            key = re.sub(r"\s+", "", cells[0])
            info[key] = cells[1]
    return info


def fetch_description(doc_url):
    """보도자료 구글 문서에서 '책 소개' 본문을 추출한다."""
    m = re.search(r"/document/d/([\w-]+)", doc_url or "")
    if not m:
        return ""
    try:
        raw = fetch(
            f"https://docs.google.com/document/d/{m.group(1)}/export?format=txt"
        ).decode("utf-8-sig", errors="replace")
    except Exception as e:
        print(f"  ! 설명 문서 실패: {e}", file=sys.stderr)
        return ""
    # 목차가 아닌 본문 쪽 '책 소개' 헤딩 이후 텍스트를 잘라 낸다
    matches = [m2.start() for m2 in re.finditer(r"\d?\.?\s*책 소개", raw)]
    if not matches:
        return ""
    start = matches[-1]
    body = raw[start:]
    body = re.sub(r"^\d?\.?\s*책 소개\s*", "", body)
    # 다음 섹션 헤딩(저자/역자/감수 소개, 출판사 리뷰 등) 전까지
    end = re.search(r"\n\s*\d\.\s*(저[^\n]{0,12}소개|출판사 리뷰|목\s*차)", body)
    if end:
        body = body[: end.start()]
    body = body.replace("\r\n", "\n").replace("\r", "\n")
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    # 앞쪽 두세 단락 정도만 사용 (전체 보도자료는 과함)
    text = "\n\n".join(paragraphs[:3])
    return text.strip()


def sign_cover_urls(items):
    """attachment:/S3 URL 을 서명된 다운로드 URL 로 변환한다."""
    payload = {
        "urls": [
            {
                "url": it["cover"],
                "permissionRecord": {
                    "table": "block",
                    "id": it["block_id"],
                    "spaceId": SPACE_ID,
                },
                "useS3Url": False,
            }
            for it in items
        ]
    }
    d = post("/api/v3/getSignedFileUrls", payload)
    return d["signedUrls"]


def month_of(date_str):
    return (date_str or "")[:7]


def norm_pages(s):
    m = re.search(r"\d+", s or "")
    return f"{m.group(0)}쪽" if m else ""


def norm_price(s):
    m = re.search(r"[\d,]+", s or "")
    if not m:
        return ""
    n = int(m.group(0).replace(",", ""))
    return f"{n:,}원"


def ts_string(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    ids, blocks = query_collection()
    print(f"도서 {len(ids)}권 발견")

    books = []
    for bid in ids:
        v = unwrap(blocks[bid])
        props = v.get("properties") or {}
        fmt = v.get("format") or {}
        title = plain(props.get("title")).strip()
        title = re.sub(r"^\[best\]\s*", "", title, flags=re.I)
        status = plain(props.get("iiii")).strip() or "판매 중"
        field = plain(props.get("Hwi}")).strip()
        category = field.split(",")[0].strip() if field else "기타"
        buy = plain(props.get("[cgG")).strip()
        detail_doc = plain(props.get("WQxG")).strip()
        example = plain(props.get("AhVA")).strip()
        date = ""
        for seg in props.get("j|yW") or []:
            if isinstance(seg, list) and len(seg) > 1:
                for mark in seg[1]:
                    if mark[0] == "d":
                        date = mark[1].get("start_date", "")
        slug = SLUGS.get(bid)
        if not slug:
            slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or bid[:8]

        print(f"- {title} ({slug})")
        info = load_page_table(bid)
        author = next(
            (v2 for k, v2 in info.items() if k.startswith("지은이")),
            "시프트 편집부",
        )
        description = fetch_description(detail_doc)

        books.append(
            {
                "block_id": bid,
                "id": slug,
                "title": title,
                "subtitle": info.get("부제목", ""),
                "author": author,
                "category": category,
                "cover": fmt.get("page_cover", ""),
                "description": description or info.get("부제목", title),
                "publishedAt": month_of(date),
                "status": status if status in ("판매 중", "절판") else "판매 중",
                "buy": buy,
                "resources": example,
                "isbn": info.get("ISBN", ""),
                "pageCount": norm_pages(info.get("페이지", "")),
                "price": norm_price(info.get("정가", "")),
                "featured": slug in FEATURED,
            }
        )

    # 표지 다운로드
    covers_dir = ROOT / "public" / "covers"
    covers_dir.mkdir(parents=True, exist_ok=True)
    with_cover = [b for b in books if b["cover"]]
    signed = sign_cover_urls(with_cover)
    for b, url in zip(with_cover, signed):
        dest = covers_dir / f"{b['id']}.jpg"
        try:
            dest.write_bytes(fetch(url))
            b["coverUrl"] = f"/covers/{b['id']}.jpg"
            print(f"  표지 저장: {dest.name} ({dest.stat().st_size} bytes)")
        except Exception as e:
            print(f"  ! 표지 실패 {b['id']}: {e}", file=sys.stderr)
            b["coverUrl"] = ""

    # seed-books.ts 생성
    lines = [
        'import type { Book } from "@/lib/types";',
        "",
        "/**",
        " * Notion 공개 카탈로그(https://shiftbook.notion.site/)에서 수집한 실제 도서 데이터.",
        " * scripts/fetch-notion-books.py 로 재생성할 수 있습니다.",
        " */",
        "export const SEED_BOOKS: Book[] = [",
    ]
    for b in books:
        lines.append("  {")
        lines.append(f"    id: {ts_string(b['id'])},")
        lines.append(f"    title: {ts_string(b['title'])},")
        if b["subtitle"]:
            lines.append(f"    subtitle: {ts_string(b['subtitle'])},")
        lines.append(f"    author: {ts_string(b['author'])},")
        lines.append(f"    category: {ts_string(b['category'])},")
        if b.get("coverUrl"):
            lines.append(f"    coverUrl: {ts_string(b['coverUrl'])},")
        lines.append(f"    description: {ts_string(b['description'])},")
        lines.append(f"    publishedAt: {ts_string(b['publishedAt'])},")
        lines.append(f"    status: {ts_string(b['status'])},")
        link_parts = []
        if b["buy"]:
            link_parts.append(f"naver: {ts_string(b['buy'])}")
        if b["resources"]:
            link_parts.append(f"resources: {ts_string(b['resources'])}")
        lines.append("    links: { " + ", ".join(link_parts) + " }," if link_parts else "    links: {},")
        if b["isbn"]:
            lines.append(f"    isbn: {ts_string(b['isbn'])},")
        if b["pageCount"]:
            lines.append(f"    pageCount: {ts_string(b['pageCount'])},")
        if b["price"]:
            lines.append(f"    price: {ts_string(b['price'])},")
        if b["featured"]:
            lines.append("    featured: true,")
        lines.append("  },")
    lines.append("];")
    lines.append("")

    out = ROOT / "data" / "seed-books.ts"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n생성 완료: {out.relative_to(ROOT)} ({len(books)}권)")


if __name__ == "__main__":
    main()
