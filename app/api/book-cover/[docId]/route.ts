import { extractDocCover } from "@/lib/google/doc";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;

  if (!/^[\w-]+$/.test(docId)) {
    return new Response(null, { status: 400 });
  }

  const cover = await extractDocCover(docId);
  if (!cover) {
    return new Response(null, { status: 404 });
  }

  return new Response(new Uint8Array(cover.data), {
    headers: {
      "Content-Type": cover.contentType,
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
