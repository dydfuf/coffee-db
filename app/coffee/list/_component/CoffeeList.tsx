"use client";

import { useEffect, useState } from "react";
import { CoffeeInfo, CoffeeInfoField } from "../../../../types/coffee";
import {
  getAllNationByCoffeeInfoList,
  getAllNotesByCoffeeInfoList,
} from "../../../../utils/coffee";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import NoteBadge from "../../../../components/NoteBadge";
import CoffeeFilter from "./CoffeeFilter";
import MobileCoffeeFilter from "./MobileCoffeeFilter";

interface Props {
  coffeeInfoList: CoffeeInfo[];
}

export default function CoffeeList({ coffeeInfoList }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const allNations = getAllNationByCoffeeInfoList(coffeeInfoList);
  const [allNotes, setAllNotes] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const selectedNations = searchParams.get("nation")
    ? searchParams.get("nation")?.split(",") ?? []
    : [];
  const selectedNotes = searchParams.get("note")
    ? searchParams.get("note")?.split(",") ?? []
    : [];

  useEffect(() => {
    if (selectedNations.length === 0) {
      setAllNotes(getAllNotesByCoffeeInfoList(coffeeInfoList, allNations));
      return;
    }

    setAllNotes(getAllNotesByCoffeeInfoList(coffeeInfoList, selectedNations));
  }, [searchParams]);

  const filterByNations = (coffeeInfo: CoffeeInfo) => {
    const hasSelectedNations = selectedNations.length > 0;

    if (hasSelectedNations) {
      return selectedNations.includes(coffeeInfo[CoffeeInfoField.NATION]);
    }
    return true;
  };

  const filterByNotes = (coffeeInfo: CoffeeInfo) => {
    const hasSelectedNotes = selectedNotes.length > 0;

    if (hasSelectedNotes) {
      const coffeeNotes =
        coffeeInfo[CoffeeInfoField.NOTE_FOR_FILTER].split(",");
      return coffeeNotes.some((note) => selectedNotes.includes(note.trim()));
    }
    return true;
  };

  const filteredCoffeeInfoList = coffeeInfoList
    .filter(filterByNations)
    .filter(filterByNotes);

  const onSelectedNationsChange = (value: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("nation", value.join(","));

    router.replace(`${pathname}?${params.toString()}`);
  };
  const onSelectedNotesChange = (value: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("note", value.join(","));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filterProps = {
    allNations,
    allNotes,
    selectedNations,
    onSelectedNationsChange,
    selectedNotes,
    onSelectedNotesChange,
  };

  return (
    <div className="mx-auto px-8 pt-4 pb-8 flex flex-col gap-4 w-[1024px]">
      <CoffeeFilter {...filterProps} />
      <MobileCoffeeFilter {...filterProps} />
      {filteredCoffeeInfoList.map((coffeeInfo) => (
        <Link
          href={`/coffee/${coffeeInfo[CoffeeInfoField.ID].split("-")[1]}`}
          key={coffeeInfo[CoffeeInfoField.ID]}
          className="flex flex-col p-8 border-[1px] rounded-lg hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex flex-col">
            <p className="text-xl">{coffeeInfo[CoffeeInfoField.NAME_KR]}</p>
            <p className="text-sm text-muted-foreground">
              {coffeeInfo[CoffeeInfoField.NAME_EN]}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {coffeeInfo[CoffeeInfoField.NOTE].split(",").map((note) => (
                <NoteBadge key={note}>{note}</NoteBadge>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
