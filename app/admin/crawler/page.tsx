"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CoffeeCrawl } from "@/schema/coffee-crawl";
import { pageTypeEnum } from "@/schema/coffee-crawl";
import type { z } from "zod";

type PageType = z.infer<typeof pageTypeEnum>;

const PAGE_TYPES: { value: PageType; label: string }[] = [
  { value: "menu", label: "메뉴" },
  { value: "product", label: "제품" },
  { value: "blog", label: "블로그" },
  { value: "review", label: "리뷰" },
  { value: "news", label: "뉴스" },
  { value: "brand", label: "브랜드" },
  { value: "cafeteria", label: "카페" },
  { value: "roastery", label: "로스터리" },
  { value: "landing", label: "랜딩" },
  { value: "other", label: "기타" },
];

export default function AdminCrawlerPage() {
  const [url, setUrl] = useState("");
  const [pageType, setPageType] = useState<PageType>("menu");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoffeeCrawl | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pageType }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      setResult((data.object ?? data) as CoffeeCrawl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "요청에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">LLM 크롤링 · 커피 정보 추출</h1>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <Label htmlFor="url">대상 URL</Label>
          <Input id="url" placeholder="https://example.com/coffee" value={url} onChange={(e) => setUrl(e.target.value)} required />
        </div>
        <div className="md:col-span-1">
          <Label>페이지 타입</Label>
          <Select value={pageType} onValueChange={(v) => setPageType(v as PageType)}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "분석 중..." : "크롤링 및 분석"}
          </Button>
        </div>
      </form>

      {error && (
        <p className="text-destructive mt-4">{error}</p>
      )}

      {result && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>요약 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="text-muted-foreground">원본 링크:</span> {result.source_url ? (<a href={result.source_url} className="underline" target="_blank" rel="noreferrer">{result.source_url}</a>) : "-"}</div>
              <div><span className="text-muted-foreground">제목:</span> {result.title ?? "-"}</div>
              <div><span className="text-muted-foreground">페이지 타입:</span> {result.page_type}</div>
              <div><span className="text-muted-foreground">이름(한):</span> {result.name_kr ?? "-"}</div>
              <div><span className="text-muted-foreground">이름(영):</span> {result.name_en ?? "-"}</div>
              <div><span className="text-muted-foreground">원산지:</span> {result.origin ?? "-"}</div>
              <div><span className="text-muted-foreground">노트:</span> {(result.notes ?? []).join(", ")}</div>
              <div><span className="text-muted-foreground">가격:</span> {result.price ?? "-"}</div>
              <div><span className="text-muted-foreground">설명:</span> {result.description ?? "-"}</div>
              <div className="flex flex-wrap gap-2">
                <span className="text-muted-foreground">이미지:</span>
                {(result.images ?? []).slice(0, 5).map((u, idx) => (
                  <a key={u + idx} href={u} target="_blank" rel="noreferrer" className="underline truncate max-w-[16rem]">{u}</a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>원본 JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea className="font-mono text-xs h-72" readOnly value={JSON.stringify(result, null, 2)} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}