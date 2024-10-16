import Link from "next/link";
import { Button } from "@/components/ui/button";
import NoteBadge from "@/components/NoteBadge";

export default function GlobalNotFoundPage() {
  return (
    <div className="container flex items-center justify-start flex-col p-10 space-y-8">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-bold">해당 페이지를 찾을 수 없습니다.</h2>
      <div className="grid grid-cols-2 w-full gap-4 md:w-[400px]">
        <Link href={"/"} className="w-full">
          <Button className="w-full text-lg font-semibold">홈으로</Button>
        </Link>

        <Link href={"/coffee/list"} className="w-full">
          <Button className="w-full text-lg font-semibold">
            커피 리스트로
          </Button>
        </Link>
      </div>

      <h3 className="text-xl font-semibold">아래 원두는 어때요?</h3>
      <Link
        href={`/coffee/127`}
        className="flex flex-col p-8 border-[1px] rounded-lg hover:bg-accent hover:text-accent-foreground w-full md:w-[400px]"
      >
        <div className="flex flex-col">
          <p className="text-xl">에티오피아 예가체프 아리차 워시드</p>
          <p className="text-sm text-muted-foreground">
            Ethiopia Yirgacheffe Aricha Washed
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {["플로럴", "살구", "블루베리", "오렌지"].map((note) => (
              <NoteBadge key={note}>{note}</NoteBadge>
            ))}
          </div>
        </div>
      </Link>
      <Link
        href={`/coffee/141`}
        className="flex flex-col p-8 border-[1px] rounded-lg hover:bg-accent hover:text-accent-foreground w-full md:w-[400px]"
      >
        <div className="flex flex-col">
          <p className="text-xl">
            과테말라 엘 인헤르토 레전드리 라스 밀파스 게이샤 워시드
          </p>
          <p className="text-sm text-muted-foreground">
            Guatemala El Injerto Legendary Geisha (Las Milpas)
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "향수같은 재스민",
              "라벤더",
              "백도",
              "복숭아",
              "레몬",
              "라임",
              "꿀",
            ].map((note) => (
              <NoteBadge key={note}>{note}</NoteBadge>
            ))}
          </div>
        </div>
      </Link>

      <h3 className="text-xl font-semibold">내 취향을 모르겠다면?</h3>
      <div className="grid grid-cols-2 w-full gap-4 md:w-[400px]">
        <Link href={"/coffee/list?nation=에티오피아"} className="w-full">
          <Button className="w-full font-semibold" variant={"secondary"}>
            에티오피아 원두 보러가기
          </Button>
        </Link>
        <Link href={"/coffee/list?note=포도"} className="w-full">
          <Button className="w-full font-semibold" variant={"secondary"}>
            포도 노트 원두 보러가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
