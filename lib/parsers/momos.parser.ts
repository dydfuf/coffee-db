import * as cheerio from "cheerio";
import { CoffeeCrawl } from "@/schema/coffee-crawl";

export async function parseMomos(url: string): Promise<Partial<CoffeeCrawl>> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $(".prd-title .name").text().trim();

    let notes: string[] = [];
    $('li[data-title="노트"]').each((i, el) => {
        const notesText = $(el).text();
        // "사과, 초콜렛, 엿, 대추"
        notes = notesText.split(',').map(note => note.trim()).filter(Boolean);
    });

    const origin = extractOriginFromName(name);

    const description = $('meta[name="description"]').attr("content")?.trim() ?? null;
    const images = [$('meta[property="og:image"]').attr("content")?.trim() ?? ""] .filter(Boolean);

    const priceText = $('li[data-title="판매가"]').text().replace(/[^0-9]/g, '');
    const price = priceText ? `${parseInt(priceText, 10)}원` : null;


    const coffeeData: Partial<CoffeeCrawl> = {
      name_kr: name,
      name_en: name, // Assuming the same for now
      notes: notes,
      origin: origin,
      description: description,
      images: images,
      price: price,
      source_url: url,
    };

    return coffeeData;
  } catch (error) {
    console.error("Error parsing Momos Coffee page:", error);
    return { source_url: url };
  }
}

function extractOriginFromName(name: string): string | null {
    if (name.includes("콜롬비아")) return "콜롬비아";
    if (name.includes("에티오피아")) return "에티오피아";
    if (name.includes("브라질")) return "브라질";
    if (name.includes("케냐")) return "케냐";
    if (name.includes("코스타리카")) return "코스타리카";
    if (name.includes("온두라스")) return "온두라스";
    if (name.includes("파나마")) return "파나마";
    // Add more mappings as needed
    return null;
}
