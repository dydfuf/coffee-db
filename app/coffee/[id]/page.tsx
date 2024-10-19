import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoffeeInfoField } from "../../../types/coffee";
import NoteBadge from "../../../components/NoteBadge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import { getCoffeeInfoById } from "../../../utils/api";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const coffeeInfo = await getCoffeeInfoById(id);

  const parentOpengraph = (await parent).openGraph || {};
  const parentTwitter = (await parent).twitter || {};

  return {
    title: coffeeInfo.name_kr ?? "",
    openGraph: {
      ...parentOpengraph,
      title: coffeeInfo.name_kr ?? "",
    },
    twitter: {
      ...parentTwitter,
      title: coffeeInfo.name_kr ?? "",
    },
  };
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function page({ params: { id } }: Props) {
  const coffeeInfo = await getCoffeeInfoById(id);

  const CoffeeInfoData = [
    {
      key: CoffeeInfoField.NAME_KR,
      label: "Name(KR)",
      value: coffeeInfo.name_kr,
      isLink: false,
    },
    {
      key: CoffeeInfoField.NAME_EN,
      label: "Name(EN)",
      value: coffeeInfo.name_en,
      isLink: false,
    },
    {
      key: CoffeeInfoField.PROCESS,
      label: "Process",
      value: coffeeInfo.processing,
      isLink: false,
    },

    {
      key: CoffeeInfoField.REGION,
      label: "Region",
      value: coffeeInfo.origin,
      isLink: false,
    },
    {
      key: CoffeeInfoField.FARM,
      label: "Farm",
      value: coffeeInfo.farm,
      isLink: false,
    },
    {
      key: CoffeeInfoField.VARIETY,
      label: "Variety",
      value: coffeeInfo.variety,
      isLink: false,
    },

    {
      key: CoffeeInfoField.SOURCE,
      label: "Source",
      value: coffeeInfo.source_origin_url,
      isLink: true,
    },
  ];

  return (
    <div className="mx-auto flex items-start md:items-center justify-center w-full">
      <div className="p-4 w-full flex justify-center">
        <Card className="w-full md:w-[40rem] relative">
          <CardHeader>
            <CardTitle className="text-3xl">{coffeeInfo.name_kr}</CardTitle>
            <CardDescription>{coffeeInfo.name_en}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-wrap gap-2 col-span-2">
              {coffeeInfo.notes?.map((note) => (
                <NoteBadge key={note}>{note}</NoteBadge>
              ))}
            </div>
            {CoffeeInfoData.map((data) => (
              <div key={data.key} className={cn("flex flex-col")}>
                <p className="text-lg font-bold">{data.label}</p>
                {data.isLink ? (
                  <Link
                    href={data.value ?? "/"}
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
        </Card>
      </div>
    </div>
  );
}
