import { coffeeCrawlSchema } from "@/schema/coffee-crawl";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export const maxDuration = 30;

function stripHtml(html: string) {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, " ");
  const text = withoutStyles.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

function extractTitle(html: string) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractOgImages(html: string) {
  const regex = /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"]+)["'][^>]*>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

export async function POST(req: Request) {
  try {
    const { url, pageType } = await req.json();
    if (!url || !pageType) {
      return new Response("Missing url or pageType", { status: 400 });
    }

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      return new Response(`Failed to fetch source: ${res.status}`, { status: 502 });
    }
    const html = await res.text();

    const title = extractTitle(html);
    const images = extractOgImages(html).slice(0, 5);
    const text = stripHtml(html).slice(0, 6000);

    const prompt = `다음은 특정 웹페이지에서 추출한 텍스트입니다. 페이지 유형(Page Type)에 맞춰 커피 관련 정보를 스키마에 따라 구조화하세요.\n\n요구사항:\n- 스키마(coffeeCrawlSchema)를 반드시 준수하여 JSON 객체로만 응답하세요.\n- 불확실한 필드는 null 로 두세요.\n- notes 는 가능한 한 표준화된 표현으로 배열로 작성하세요.\n- images 는 가능한 경우 제공된 대표 이미지 URL 목록에서 선택하세요.\n- page_type 은 입력으로 주어진 값을 그대로 사용하세요.\n- source_url 은 반드시 입력 URL(${url})을 그대로 설정하세요.\n\n입력 URL: ${url}\n페이지 제목: ${title ?? ""}\n페이지 타입: ${pageType}\n대표 이미지 후보: ${images.join(", ")}\n텍스트(일부):\n${text}`;

    const obj = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: coffeeCrawlSchema,
      prompt,
    });

    return obj.toJsonResponse();
  } catch (e: unknown) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}