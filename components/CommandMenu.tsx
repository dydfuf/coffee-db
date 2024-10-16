"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogProps } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { CoffeeInfo, CoffeeInfoField } from "../types/coffee";
import { Badge } from "@/components/ui/badge";
import { hangulIncludes, chosungIncludes } from "@toss/hangul";
import { usePathname, useRouter } from "next/navigation";

interface Props extends DialogProps {
  isInNav?: boolean;
  list: CoffeeInfo[];
}

export default function CommandMenu({ isInNav, list, ...props }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  if (isInNav && isHome) return null;

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative rounded-[0.5rem] bg-background shadow-none sm:pr-12",
          "justify-start flex items-center",
          "text-sm font-normal text-muted-foreground",
          { "w-full md:w-[20rem]": isInNav, "w-full md:w-[40rem]": !isInNav },
          { "h-12": !isInNav }
        )}
        onClick={() => {
          setOpen(true);
        }}
        {...props}
      >
        <span className="hidden lg:inline-flex">커피를 검색해보세요 ☕️</span>
        <span className="inline-flex lg:hidden">커피 검색 ☕️</span>
        <kbd className="pointer-events-none absolute right-[0.5rem] hidden h-6 leading-6 select-none items-center gap-1 rounded border bg-muted px-3 text-[14px] font-medium opacity-100 sm:flex">
          <span>⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        filter={(value, search) => {
          if (value.includes(search)) return 1;
          if (hangulIncludes(value, search)) return 1;
          if (chosungIncludes(value, search)) return 1;
          return 0;
        }}
        open={open}
        onOpenChange={setOpen}
        dialogContentClassName="top-0 translate-y-0 md:top-1/2 md:-translate-y-1/2"
      >
        <CommandInput placeholder="원두 이름 및 노트를 입력 해보세요. 🚀" />
        <CommandList className="max-h-[80dvh]">
          <CommandEmpty>정보를 찾을 수 없어요. 😭</CommandEmpty>{" "}
          <CommandGroup heading={"원두 정보"}>
            {list.map((coffeeInfo) => (
              <CommandItem
                key={coffeeInfo[CoffeeInfoField.ID]}
                value={getCoffeeItemValue(coffeeInfo)}
                onSelect={() => {
                  runCommand(() => {
                    router.push(
                      `/coffee/${coffeeInfo[CoffeeInfoField.ID].split("-")[1]}`
                    );
                  });
                }}
              >
                <div className="flex flex-col">
                  <p className="text-xl">
                    {coffeeInfo[CoffeeInfoField.NAME_KR]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {coffeeInfo[CoffeeInfoField.NAME_EN]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {coffeeInfo[CoffeeInfoField.NOTE].split(",").map((note) => (
                      <Badge key={note} variant={"outline"}>
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

const getCoffeeItemValue = (coffeeInfo: CoffeeInfo) =>
  coffeeInfo[CoffeeInfoField.NAME_KR] +
  " " +
  coffeeInfo[CoffeeInfoField.NAME_EN] +
  " " +
  coffeeInfo[CoffeeInfoField.REGION] +
  " " +
  coffeeInfo[CoffeeInfoField.FARM] +
  " " +
  coffeeInfo[CoffeeInfoField.VARIETY] +
  " " +
  coffeeInfo[CoffeeInfoField.PROCESS] +
  " " +
  coffeeInfo[CoffeeInfoField.NOTE];
