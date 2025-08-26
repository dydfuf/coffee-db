import { coffeeCrawlSchema, type CoffeeCrawl } from "@/schema/coffee-crawl";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import * as cheerio from "cheerio";
import { parseMomos } from "@/lib/parsers/momos.parser";

export const maxDuration = 60;

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

function extractDetailImages(html: string, pageUrl: string) {
  const $ = cheerio.load(html);
  const imageUrls = new Set<string>();

  // OG Image
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) {
    imageUrls.add(new URL(ogImage, pageUrl).toString());
  }

  // Images in product detail section
  $("#prdDetail img, .edibot-product-detail img").each((i, el) => {
    const src = $(el).attr("src") || $(el).attr("ec-data-src");
    if (src && !src.startsWith("data:")) {
      imageUrls.add(new URL(src, pageUrl).toString());
    }
  });

  return Array.from(imageUrls).slice(0, 10); // Limit to 10 images
}

export async function POST(req: Request) {
  console.log("CRAWL API HIT");
  try {
    const { url, pageType } = await req.json();
    if (!url || !pageType) {
      return new Response("Missing url or pageType", { status: 400 });
    }

    const urlObject = new URL(url);
    const hostname = urlObject.hostname.replace("www.", "");

    // Site-specific parser dispatch
    if (hostname === "momos.co.kr") {
      const parsedData = await parseMomos(url);
      return new Response(JSON.stringify({ object: parsedData }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback to multimodal LLM-based parsing
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return new Response(`Failed to fetch source: ${res.status}`, { status: 502 });
    }
    const html = await res.text();

    const title = extractTitle(html);
    const text = stripHtml(html).slice(0, 4000);
    const images = extractDetailImages(html, url);

    const textPrompt = `You are a coffee expert. Extract coffee information from the provided web page content based on the given schema.

**Instructions:**
- Adhere strictly to the 'coffeeCrawlSchema' and respond only with a JSON object.
- Leave any uncertain fields as 'null'.
- For 'notes', use standardized expressions and format them as an array.
- For 'images', select the most representative product image URL from the provided list if possible.
- Use the provided 'page_type' value as is.
- Set 'source_url' to the input URL: ${url}.

**Input URL:** ${url}
**Page Title:** ${title ?? ""}
**Page Type:** ${pageType}
**Page Text (partial):**
${text}`;

    const imageContent = images.map(imageUrl => ({
      type: "image" as const,
      image: new URL(imageUrl),
    }));

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: coffeeCrawlSchema,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: textPrompt }, ...imageContent],
        },
      ],
    });

    return new Response(JSON.stringify({ object }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}