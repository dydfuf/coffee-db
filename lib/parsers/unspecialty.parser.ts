import * as cheerio from "cheerio";
import { CoffeeCrawl } from "@/schema/coffee-crawl";

export async function parseUnspecialty(url: string): Promise<Partial<CoffeeCrawl>> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Unspecialty puts a lot of info in images, so we extract what we can.
  // The LLM fallback might be more effective for this site.

  const name = $("meta[property='og:title']").attr("content")?.trim() ?? null;
  const description = $("meta[property='og:description']").attr("content")?.trim() ?? null;
  const image = $("meta[property='og:image']").attr("content")?.trim() ?? null;

  // Attempt to find notes and origin in the text, though they are likely in images.
  // This is a placeholder for more advanced parsing if the site structure changes.
  let notes: string[] = [];
  const bodyText = $("body").text();

  // A very simple keyword search for notes. This is not reliable.
  const notesRegex = /노트\s*:\s*([^\n]+)/;
  const notesMatch = bodyText.match(notesRegex);
  if (notesMatch) {
    notes = notesMatch[1].split(",").map(n => n.trim());
  }

  const coffeeData: Partial<CoffeeCrawl> = {
    name_kr: name,
    name_en: null, // English name not typically available
    description: description,
    notes: notes.length > 0 ? notes : null,
    origin: null, // Origin is in an image
    images: image ? [image] : [],
  };

  return coffeeData;
}
