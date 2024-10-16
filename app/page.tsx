import { siteConfig } from "../constants/siteConfig";
import Link from "next/link";
import { Button } from "../components/ui/button";
import CommandMenu from "../components/CommandMenu";
import { getCoffeeInfoList } from "../utils/api";

export default async function Home() {
  const coffeeInfoList = getCoffeeInfoList();

  return (
    <div className="mx-auto grow flex w-full">
      <div className="flex flex-col items-center w-full space-y-4 mx-[2rem]">
        <h1
          className="h-[120px]"
          style={{
            marginTop: `calc(50dvh - 28px - 120px - 120px)`,
            alignContent: "end",
          }}
        >
          <span className="font-bold text-[3rem] sm:text-[5rem]">
            {siteConfig.name}
          </span>
        </h1>
        <CommandMenu list={coffeeInfoList} />
        <p className="text-[1rem] sm:text-[1.25rem]">
          당신의 취향에 맞는 완벽한 커피 원두를 찾아보세요!
        </p>
        <h3 className="text-xl font-semibold pt-16">내 취향을 모르겠다면?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:w-[400px]">
          <Link href={"/coffee/list?nation=에티오피아"} className="w-full">
            <Button className="w-full font-semibold" variant={"secondary"}>
              에티오피아 원두 보러가기
            </Button>
          </Link>
          <Link href={"/coffee/list?nation=과테말라"} className="w-full">
            <Button className="w-full font-semibold" variant={"secondary"}>
              과테말라 원두 보러가기
            </Button>
          </Link>
          <Link href={"/coffee/list?note=포도"} className="w-full">
            <Button className="w-full font-semibold" variant={"secondary"}>
              포도 맛 원두 보러가기
            </Button>
          </Link>
          <Link href={"/coffee/list?note=복숭아"} className="w-full">
            <Button className="w-full font-semibold" variant={"secondary"}>
              복숭아 맛 원두 보러가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
