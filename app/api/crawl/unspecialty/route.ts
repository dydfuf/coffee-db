import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_TARGET_URL =
  "https://unspecialty.com/product/detail.html?product_no=390";
const ALLOWED_HOSTS = new Set(["unspecialty.com", "www.unspecialty.com"]);

const ORIGIN_KEYWORDS = [
  "에티오피아",
  "콜롬비아",
  "코스타리카",
  "케냐",
  "파나마",
  "과테말라",
  "온두라스",
  "엘살바도르",
  "브라질",
  "인도네시아",
  "예멘",
  "르완다",
  "부룬디",
  "탄자니아",
];

const PROCESSING_PATTERNS: { label: string; regex: RegExp }[] = [
  { label: "레드 허니", regex: /레드\s*허니/i },
  { label: "화이트 허니", regex: /화이트\s*허니/i },
  { label: "풀리 워시드", regex: /풀리\s*워시드/i },
  { label: "언에어로빅", regex: /언에어로빅|anaerobic/i },
  { label: "슈가케인 EA", regex: /슈가케인|sugar\s*cane|\bEA\b/i },
  { label: "워시드", regex: /워시드|washed/i },
  { label: "내추럴", regex: /내추럴|natural/i },
  { label: "허니", regex: /허니|honey/i },
  { label: "디카페인", regex: /디카페인|decaf/i },
  { label: "ASD", regex: /\bASD\b/i },
];

const VARIETY_PATTERNS: { label: string; regex: RegExp }[] = [
  { label: "게이샤", regex: /게이샤|geisha/i },
  { label: "SL28", regex: /\bSL28\b/i },
  { label: "SL34", regex: /\bSL34\b/i },
  { label: "카투아이", regex: /카투아이|catuai/i },
  { label: "버번", regex: /핑크\s*버번|버번|bourbon/i },
  { label: "자바", regex: /자바|java/i },
];

const NOTE_PATTERNS: { label: string; regex: RegExp }[] = [
  { label: "베리", regex: /베리|berry/i },
  { label: "과일", regex: /과일|fruit/i },
  { label: "복숭아", regex: /복숭아|peach/i },
  { label: "꽃", regex: /꽃|flower|blossom/i },
  { label: "너티", regex: /너티|nutty|nut/i },
  { label: "초콜릿", regex: /초코|초콜릿|choco|chocolate/i },
  { label: "자스민", regex: /자스민|jasmine/i },
  { label: "오렌지", regex: /오렌지|orange/i },
  { label: "체리", regex: /체리|cherry/i },
];

type ExtractedPageData = {
  pageTitle: string | null;
  canonicalUrl: string | null;
  productNo: number | null;
  productName: string | null;
  description: string | null;
  price: string | null;
  currency: string | null;
  images: string[];
  detailText: string | null;
  infoTable: { key: string; value: string }[];
  offerOptionNames: string[];
  selectOptionNames: string[];
};

function normalizeWhitespace(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function normalizePrice(price: string | null, currency: string | null) {
  const normalized = normalizeWhitespace(price);
  if (!normalized) return null;
  if (/[₩원]/.test(normalized)) return normalized;

  const numberOnly = normalized.replace(/,/g, "");
  if (/^\d+$/.test(numberOnly) && currency === "KRW") {
    return `${Number(numberOnly).toLocaleString("ko-KR")}원`;
  }
  return normalized;
}

function parseTargetUrl(rawUrl?: string) {
  const candidate = normalizeWhitespace(rawUrl) ?? DEFAULT_TARGET_URL;
  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function isAllowedUnspecialtyUrl(url: URL) {
  return (
    ALLOWED_HOSTS.has(url.hostname) &&
    url.pathname === "/product/detail.html" &&
    url.searchParams.has("product_no")
  );
}

function detectLabels(texts: string[], patterns: { label: string; regex: RegExp }[]) {
  const combined = texts.join(" ");
  return patterns.filter((item) => item.regex.test(combined)).map((item) => item.label);
}

function detectOrigins(texts: string[]) {
  const combined = texts.join(" ");
  return ORIGIN_KEYWORDS.filter((origin) => combined.includes(origin));
}

function parseNotesFromTitleAndOptions(title: string | null, optionNames: string[]) {
  const sourceTexts = [title ?? "", ...optionNames];
  return detectLabels(sourceTexts, NOTE_PATTERNS);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = parseTargetUrl(body?.url);

    if (!targetUrl) {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!isAllowedUnspecialtyUrl(targetUrl)) {
      return Response.json(
        {
          error:
            "Only unspecialty product detail URLs are allowed. Example: https://unspecialty.com/product/detail.html?product_no=390",
        },
        { status: 400 }
      );
    }

    const { chromium } = await import("playwright");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let extracted: ExtractedPageData;

    try {
      const page = await browser.newPage({
        locale: "ko-KR",
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      });

      await page.goto(targetUrl.toString(), {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.waitForTimeout(1_200);

      extracted = await page.evaluate(() => {
        const norm = (value: string | null | undefined) => {
          if (!value) return null;
          const normalized = value.replace(/\s+/g, " ").trim();
          return normalized.length > 0 ? normalized : null;
        };
        const uniq = (values: string[]) => [...new Set(values)];

        const toAbsoluteUrl = (value: string | null | undefined) => {
          const normalized = norm(value);
          if (!normalized) return null;
          if (normalized.startsWith("//")) {
            return `https:${normalized}`;
          }
          try {
            return new URL(normalized, window.location.origin).toString();
          } catch {
            return null;
          }
        };

        const queryText = (selector: string) =>
          norm(document.querySelector(selector)?.textContent);

        const queryAttr = (selector: string, attr: string) =>
          norm(document.querySelector(selector)?.getAttribute(attr));

        const parseJsonLdBlocks = () => {
          const blocks = Array.from(
            document.querySelectorAll('script[type="application/ld+json"]')
          )
            .map((node) => node.textContent ?? "")
            .map((text) => text.trim())
            .filter(Boolean);

          const products: Record<string, unknown>[] = [];

          const visit = (value: unknown) => {
            if (!value) return;
            if (Array.isArray(value)) {
              value.forEach(visit);
              return;
            }
            if (typeof value !== "object") return;
            const obj = value as Record<string, unknown>;
            const typeRaw = obj["@type"];
            const types = Array.isArray(typeRaw)
              ? typeRaw
              : typeof typeRaw === "string"
              ? [typeRaw]
              : [];
            if (types.includes("Product")) {
              products.push(obj);
            }
            Object.values(obj).forEach(visit);
          };

          for (const block of blocks) {
            try {
              const parsed = JSON.parse(block);
              visit(parsed);
            } catch {
              continue;
            }
          }

          return products[0] ?? null;
        };

        const productJsonLd = parseJsonLdBlocks();
        const ldProductName =
          typeof productJsonLd?.name === "string" ? norm(productJsonLd.name) : null;
        const ldDescription =
          typeof productJsonLd?.description === "string"
            ? norm(productJsonLd.description)
            : null;

        const ldImages = Array.isArray(productJsonLd?.image)
          ? productJsonLd.image
              .map((img) => (typeof img === "string" ? toAbsoluteUrl(img) : null))
              .filter((img): img is string => Boolean(img))
          : [];

        const offersRaw = Array.isArray(productJsonLd?.offers)
          ? productJsonLd.offers
          : productJsonLd?.offers
          ? [productJsonLd.offers]
          : [];

        const offerNames = offersRaw
          .map((offer) => {
            if (!offer || typeof offer !== "object") return null;
            const value = (offer as Record<string, unknown>).name;
            return typeof value === "string" ? norm(value) : null;
          })
          .filter((name): name is string => Boolean(name));

        const offerPrice =
          offersRaw
            .map((offer) => {
              if (!offer || typeof offer !== "object") return null;
              const value = (offer as Record<string, unknown>).price;
              return typeof value === "number" || typeof value === "string"
                ? String(value)
                : null;
            })
            .find(Boolean) ?? null;

        const offerCurrency =
          offersRaw
            .map((offer) => {
              if (!offer || typeof offer !== "object") return null;
              const value = (offer as Record<string, unknown>).priceCurrency;
              return typeof value === "string" ? norm(value) : null;
            })
            .find(Boolean) ?? null;

        const productName =
          queryText("#uns-info .headingArea h2") ??
          queryAttr("meta[property='og:title']", "content") ??
          ldProductName;

        const priceText =
          queryText("#span_product_price_text") ??
          queryAttr("meta[property='product:sale_price:amount']", "content") ??
          queryAttr("meta[property='product:price:amount']", "content") ??
          offerPrice;

        const currency =
          queryAttr("meta[property='product:price:currency']", "content") ??
          queryAttr("meta[property='product:sale_price:currency']", "content") ??
          offerCurrency;

        const cleanOptionName = (raw: string, anchor: string | null) => {
          let text = norm(raw) ?? "";
          if (anchor && text.startsWith(anchor)) {
            text = text.slice(anchor.length).trim();
          }
          text = text.replace(/^\s*[-:]+/, "").trim();
          text = text.replace(
            /\s*-\s*(?:\d+(?:\.\d+)?(?:g|kg)|\d+\s*개|해당없음)\s*$/i,
            ""
          );
          return norm(text);
        };

        const offerOptionNames = uniq(
          offerNames
            .map((name) => cleanOptionName(name, productName))
            .filter((name): name is string => Boolean(name))
            .filter(
              (name) =>
                name !== "월픽 인쇄물(월픽 카드와 스티커) 받지 않기" &&
                !name.includes("분쇄도 가이드")
            )
        );

        const selectOptionNames = uniq(
          Array.from(document.querySelectorAll("#product_option_id1 option"))
            .map((option) => norm(option.textContent))
            .filter((text): text is string => Boolean(text))
            .filter(
              (text) =>
                !text.startsWith("- [필수] 옵션을 선택해 주세요 -") &&
                text !== "-------------------" &&
                text !== "월픽 인쇄물(월픽 카드와 스티커) 받지 않기" &&
                !text.includes("분쇄도 가이드")
            )
        );

        const infoTable = Array.from(
          document.querySelectorAll("#uns-info .xans-product-detaildesign table tbody tr")
        )
          .map((row) => {
            const key = norm(row.querySelector("th")?.textContent);
            const value = norm(row.querySelector("td")?.textContent);
            return key && value ? { key, value } : null;
          })
          .filter(
            (
              row
            ): row is {
              key: string;
              value: string;
            } => Boolean(row)
          );

        const detailText = norm(document.querySelector("#prdDetail")?.textContent);

        const images = uniq(
          [
            ...Array.from(
              document.querySelectorAll("meta[property='og:image']")
            ).map((meta) => toAbsoluteUrl(meta.getAttribute("content"))),
            ...Array.from(document.querySelectorAll(".imgArea img")).map((img) =>
              toAbsoluteUrl(img.getAttribute("src") ?? img.getAttribute("ec-data-src"))
            ),
            ...Array.from(document.querySelectorAll("#prdDetail img")).map((img) =>
              toAbsoluteUrl(img.getAttribute("src") ?? img.getAttribute("ec-data-src"))
            ),
            ...ldImages,
          ].filter((url): url is string => Boolean(url))
        );

        const productNoFromMeta = queryAttr(
          "meta[property='product:productId']",
          "content"
        );
        const productNoFromSearch = new URLSearchParams(window.location.search).get(
          "product_no"
        );
        const parsedNo = Number(productNoFromMeta ?? productNoFromSearch);

        return {
          pageTitle: queryText("title"),
          canonicalUrl: queryAttr("link[rel='canonical']", "href"),
          productNo: Number.isFinite(parsedNo) ? parsedNo : null,
          productName,
          description: queryAttr("meta[name='description']", "content") ?? ldDescription,
          price: priceText,
          currency,
          images: images.slice(0, 40),
          detailText: detailText ? detailText.slice(0, 4000) : null,
          infoTable,
          offerOptionNames,
          selectOptionNames,
        };
      });
    } finally {
      await browser.close();
    }

    const optionNames = unique([
      ...extracted.offerOptionNames,
      ...extracted.selectOptionNames,
    ]);

    const origins = detectOrigins(optionNames);
    const processings = detectLabels(optionNames, PROCESSING_PATTERNS);
    const varieties = detectLabels(optionNames, VARIETY_PATTERNS);
    const notes = parseNotesFromTitleAndOptions(extracted.productName, optionNames);

    const price = normalizePrice(extracted.price, extracted.currency);
    const title = normalizeWhitespace(extracted.pageTitle ?? extracted.productName);
    const description = normalizeWhitespace(extracted.description);
    const canonicalUrl = normalizeWhitespace(extracted.canonicalUrl);

    const coffeeCrawl = {
      source_url: targetUrl.toString(),
      title,
      page_type: "product" as const,
      name_kr: normalizeWhitespace(extracted.productName),
      name_en: null,
      description,
      origin: origins.length > 0 ? origins.join(", ") : null,
      notes: notes.length > 0 ? notes : null,
      images: extracted.images.length > 0 ? extracted.images : null,
      price,
    };

    return Response.json({
      source_url: targetUrl.toString(),
      canonical_url: canonicalUrl ?? targetUrl.toString(),
      product_no: extracted.productNo,
      coffee_crawl: coffeeCrawl,
      coffee_options: optionNames,
      processing: processings,
      varieties,
      info_table: extracted.infoTable,
      detail_text_excerpt: extracted.detailText,
    });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Failed to crawl unspecialty page";
    return Response.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
