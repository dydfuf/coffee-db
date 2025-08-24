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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

  const nationCount = selectedNations.length;
  const noteCount = selectedNotes.length;
  const hasNationFilter = nationCount > 0;
  const hasNoteFilter = noteCount > 0;

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

      {(hasNationFilter || hasNoteFilter) && (
        // Remove negative margin to prevent overlap with buttons below
        <div className="col-span-2 px-2 mt-1 flex flex-wrap gap-2">
          {selectedNations.map((nation) => (
            <Badge key={`m-chip-nation-${nation}`} variant="secondary" className="flex items-center gap-1">
              <span>{nation}</span>
              <button
                type="button"
                className="ml-1 rounded hover:bg-muted p-0.5"
                aria-label={`${nation} 제거`}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = selectedNations.filter((n) => n !== nation);
                  setSelectedNations(next);
                  setNations(next);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedNotes.map((note) => (
            <Badge key={`m-chip-note-${note}`} variant="secondary" className="flex items-center gap-1">
              <span>{note}</span>
              <button
                type="button"
                className="ml-1 rounded hover:bg-muted p-0.5"
                aria-label={`${note} 제거`}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = selectedNotes.filter((n) => n !== note);
                  setSelectedNotes(next);
                  setNotes(next);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Drawer onClose={onCloseNationsDrawer}>
        <DrawerTrigger asChild>
          <Button
            variant="secondary"
            className="w-full h-12 rounded-xl px-4 justify-between"
            aria-label={`나라별 필터${nationCount ? `, 선택 ${nationCount}개` : ""}`}
          >
            <span className="min-w-0 flex-1 truncate">{nationFilterButtonLabel}</span>
            {nationCount > 0 && (
              <Badge
                variant="outline"
                className="h-5 min-w-[1.25rem] px-1.5 text-xs font-medium shrink-0 justify-center"
              >
                {nationCount}
              </Badge>
            )}
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
          <Button
            variant="secondary"
            className="w-full h-12 rounded-xl px-4 justify-between"
            aria-label={`노트별 필터${noteCount ? `, 선택 ${noteCount}개` : ""}`}
          >
            <span className="min-w-0 flex-1 truncate">{noteFilterButtonLabel}</span>
            {noteCount > 0 && (
              <Badge
                variant="outline"
                className="h-5 min-w-[1.25rem] px-1.5 text-xs font-medium shrink-0 justify-center"
              >
                {noteCount}
              </Badge>
            )}
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
