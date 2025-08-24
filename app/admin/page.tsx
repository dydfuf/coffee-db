import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminHomePage() {
  return (
    <div className="container py-10 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground mt-2">관리자 홈. 추후 하위 라우트를 확장할 수 있습니다.</p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/admin/crawler">LLM 크롤링 도구 열기</Link>
        </Button>
      </div>
    </div>
  );
}