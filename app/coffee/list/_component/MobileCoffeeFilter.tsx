"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";

interface Props {
  allNations: string[];
  allNotes: string[];
  selectedNations: string[];
  selectedNotes: string[];
}

export default function MobileCoffeeFilter({
  allNations,
  allNotes,
  selectedNations: _selectedNations,
  selectedNotes: _selectedNotes,
}: Props) {
  const [selectedNations, setSelectedNations] =
    useState<string[]>(_selectedNations);
  const [selectedNotes, setSelectedNotes] = useState<string[]>(_selectedNotes);

  const { setNations, setNotes, clearFilters, nationFilterButtonLabel, noteFilterButtonLabel } =
    useCoffeeFilters();

  const onCloseNationsDrawer = () => {
    setNations(selectedNations);
  };
  const onCloseNotesDrawer = () => {
    setNotes(selectedNotes);
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:hidden sticky top-[57px] bg-background pb-4">
      <div className="col-span-2 flex items-center justify-between px-2 pt-2">
        <span className="text-sm text-muted-foreground">필터</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearFilters();
            setSelectedNations([]);
            setSelectedNotes([]);
          }}
          title="모든 필터 초기화"
        >
          전체 초기화
        </Button>
      </div>
      <Drawer onClose={onCloseNationsDrawer}>
        <DrawerTrigger asChild>
          <Button>
            <span className="line-clamp-1 whitespace-pre-wrap">
              {nationFilterButtonLabel}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>나라별 필터</DrawerTitle>
            <DrawerDescription>원하는 국가를 선택해주세요.</DrawerDescription>
            <div className="flex flex-wrap gap-2 m-4">
              <ToggleGroup
                type="multiple"
                className="flex flex-wrap gap-2 justify-start"
                onValueChange={setSelectedNations}
                value={selectedNations}
              >
                {allNations.map((nation) => (
                  <ToggleGroupItem
                    key={nation}
                    value={nation}
                    variant={"outline"}
                  >
                    {nation}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary" className="text-16 h-12 font-bold">
                닫기
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer onClose={onCloseNotesDrawer}>
        <DrawerTrigger asChild>
          <Button>
            <span className="line-clamp-1 whitespace-pre-wrap">
              {noteFilterButtonLabel}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>노트별 필터</DrawerTitle>
            <DrawerDescription>원하는 노트를 선택해주세요.</DrawerDescription>
            <ScrollArea className="max-h-[60dvh] m-4">
              <div className="flex flex-wrap gap-2">
                <ToggleGroup
                  type="multiple"
                  className="flex flex-wrap gap-2 justify-start"
                  onValueChange={setSelectedNotes}
                  value={selectedNotes}
                >
                  {allNotes.map((note) => (
                    <ToggleGroupItem
                      key={note}
                      value={note}
                      variant={"outline"}
                    >
                      {note}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </ScrollArea>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary" className="text-16 h-12 font-bold">
                닫기
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
