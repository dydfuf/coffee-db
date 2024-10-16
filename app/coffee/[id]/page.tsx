import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoffeeInfo, CoffeeInfoField } from "../../../types/coffee";
import NoteBadge from "../../../components/NoteBadge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import { getCoffeeInfoList } from "../../../utils/api";

const getCoffeeInfo = async (id: string) => {
  const coffeeInfoList = getCoffeeInfoList();
  const coffeeInfo = coffeeInfoList.find(
    (coffeeInfo: { ID: string }) => coffeeInfo.ID === `COFFEE-${id}`
  );

  return coffeeInfo as CoffeeInfo;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const coffeeInfo = await getCoffeeInfo(id);

  const parentOpengraph = (await parent).openGraph || {};
  const parentTwitter = (await parent).twitter || {};

  return {
    title: coffeeInfo[CoffeeInfoField.NAME_KR],
    openGraph: {
      ...parentOpengraph,
      title: coffeeInfo[CoffeeInfoField.NAME_KR],
    },
    twitter: {
      ...parentTwitter,
      title: coffeeInfo[CoffeeInfoField.NAME_KR],
    },
  };
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function page({ params: { id } }: Props) {
  const coffeeInfo = await getCoffeeInfo(id);

  const isUserSubmitted = Boolean(coffeeInfo[CoffeeInfoField.USER_SUBMITTED]);

  const CoffeeInfoData = [
    {
      key: CoffeeInfoField.NAME_KR,
      label: "Name(KR)",
      value: coffeeInfo[CoffeeInfoField.NAME_KR],
      isLink: false,
    },
    {
      key: CoffeeInfoField.NAME_EN,
      label: "Name(EN)",
      value: coffeeInfo[CoffeeInfoField.NAME_EN],
      isLink: false,
    },
    {
      key: CoffeeInfoField.PROCESS,
      label: "Process",
      value: coffeeInfo[CoffeeInfoField.PROCESS],
      isLink: false,
    },

    {
      key: CoffeeInfoField.REGION,
      label: "Region",
      value: coffeeInfo[CoffeeInfoField.REGION],
      isLink: false,
    },
    {
      key: CoffeeInfoField.FARM,
      label: "Farm",
      value: coffeeInfo[CoffeeInfoField.FARM],
      isLink: false,
    },
    {
      key: CoffeeInfoField.VARIETY,
      label: "Variety",
      value: coffeeInfo[CoffeeInfoField.VARIETY],
      isLink: false,
    },

    {
      key: CoffeeInfoField.SOURCE,
      label: "Source",
      value: coffeeInfo[CoffeeInfoField.SOURCE],
      isLink: true,
    },
  ];

  return (
    <div className="mx-auto flex items-start md:items-center justify-center w-full">
      <div className="p-4 w-full flex justify-center">
        <Card className="w-full md:w-[40rem] relative">
          <CardHeader>
            <CardTitle className="text-3xl">
              {coffeeInfo[CoffeeInfoField.NAME_KR]}
            </CardTitle>
            <CardDescription>
              {coffeeInfo[CoffeeInfoField.NAME_EN]}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-wrap gap-2 col-span-2">
              {coffeeInfo[CoffeeInfoField.NOTE].split(",").map((note) => (
                <NoteBadge key={note}>{note}</NoteBadge>
              ))}
            </div>
            {CoffeeInfoData.map((data) => (
              <div key={data.key} className={cn("flex flex-col")}>
                <p className="text-lg font-bold">{data.label}</p>
                {data.isLink ? (
                  <Link
                    href={data.value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg shrink-0 underline"
                  >
                    정보 출처
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{data.value}</span>
                )}
              </div>
            ))}
          </CardContent>

          {isUserSubmitted && (
            <div className="absolute left-0 top-0 right-0 bottom-0 bg-gray-500/90 flex items-center justify-center">
              <span className="text-3xl font-bold text-center p-8">
                이 커피 정보는 다른 유저가 제안한 정보에요! ☕️
                <br />
                🏃🏻‍➡️🏃🏻‍♂️‍➡️🏃🏻‍♀️‍➡️
                <br />
                빠르게 확인후 업데이트 할게요! 🫡
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
