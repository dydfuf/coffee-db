"use client";

// import CoffeeData from "@/data/coffee.json";
// import { Coffee } from "@/schema/coffee";
import { redirect } from "next/navigation";

export default function TempPage() {
  // data를 마이그레이션 하기 위한 코드 입니다.
  // const { coffeeInfoList } = CoffeeData;

  // const CoffeeInfoList = coffeeInfoList.map(
  //   (coffeeInfo) =>
  //     ({
  //       name_kr: coffeeInfo["이름(한글)"],
  //       name_en: coffeeInfo["이름(영어)"],
  //       processing: coffeeInfo["프로세싱"],
  //       origin: coffeeInfo["지역"],
  //       farm: coffeeInfo["농장"],
  //       notes: coffeeInfo["노트"].split(", "),
  //       variety: coffeeInfo["품종"],
  //       altitude: null,
  //       source_origin_url: coffeeInfo["출처"],
  //       created_at: JSON.parse(coffeeInfo["Created time"]).created_time,
  //       origin_image_uri: null, // 이미지 URI가 없는 경우 null로 설정
  //       nations: coffeeInfo["국가"],
  //     } satisfies Omit<Coffee, "id">)
  // );

  return redirect("/coffee/list");
}
