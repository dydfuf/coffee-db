"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  allNations: string[];
  allNotes: string[];
  selectedNations: string[];
  selectedNotes: string[];
}

export default function CoffeeFilter({
  allNations,
  allNotes,
  selectedNations,
  selectedNotes,
}: Props) {
  const { setNations, setNotes, clearFilters, nationFilterButtonLabel, noteFilterButtonLabel } =
    useCoffeeFilters();

  const handleNationChange = (value: string[]) => {
    setNations(value);
  };

  const handleNoteChange = (value: string[]) => {
    setNotes(value);
  };

  const noActiveFilters = selectedNations.length === 0 && selectedNotes.length === 0;
  const hasNationFilter = selectedNations.length > 0;
  const hasNoteFilter = selectedNotes.length > 0;
  const nationCount = selectedNations.length;
  const noteCount = selectedNotes.length;

  return (
    <div className="hidden md:block sticky top-[57px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between py-2 px-2">
        <span className="text-sm text-muted-foreground">필터</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          title="모든 필터 초기화"
          aria-label="전체 필터 초기화"
          disabled={noActiveFilters}
        >
          전체 초기화
        </Button>
      </div>

      {(hasNationFilter || hasNoteFilter) && (
        <div className="px-2 pb-2 flex flex-wrap gap-2">
          {selectedNations.map((nation) => (
            <Badge key={`chip-nation-${nation}`} variant="secondary" className="flex items-center gap-1">
              <span>{nation}</span>
              <button
                type="button"
                className="ml-1 rounded hover:bg-muted p-0.5"
                aria-label={`${nation} 제거`}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = selectedNations.filter((n) => n !== nation);
                  setNations(next);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedNotes.map((note) => (
            <Badge key={`chip-note-${note}`} variant="secondary" className="flex items-center gap-1">
              <span>{note}</span>
              <button
                type="button"
                className="ml-1 rounded hover:bg-muted p-0.5"
                aria-label={`${note} 제거`}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = selectedNotes.filter((n) => n !== note);
                  setNotes(next);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Accordion type="single" className="" collapsible>
        <AccordionItem value="nation">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="line-clamp-1 whitespace-pre-wrap">
                {nationFilterButtonLabel}
              </span>
              {nationCount > 0 && (
                <Badge variant="outline" className="h-5 px-1.5 text-xs">{nationCount}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-end pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNations([])}
                disabled={!hasNationFilter}
                aria-label="나라 필터 초기화"
              >
                초기화
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 bg-background">
              <ToggleGroup
                key={selectedNations.join("|")}
                type="multiple"
                className="flex flex-wrap gap-2 justify-start"
                onValueChange={handleNationChange}
                defaultValue={selectedNations}
              >
                {allNations.map((nation) => (
                  <ToggleGroupItem key={nation} value={nation} variant={"outline"}>
                    {nation}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="note">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="line-clamp-1 whitespace-pre-wrap">
                {noteFilterButtonLabel}
              </span>
              {noteCount > 0 && (
                <Badge variant="outline" className="h-5 px-1.5 text-xs">{noteCount}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-end pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotes([])}
                disabled={!hasNoteFilter}
                aria-label="노트 필터 초기화"
              >
                초기화
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 bg-background">
              <ScrollArea className="max-h-[60dvh]">
                <ToggleGroup
                  key={selectedNotes.join("|")}
                  type="multiple"
                  className="flex flex-wrap gap-2 justify-start"
                  onValueChange={handleNoteChange}
                  defaultValue={selectedNotes}
                >
                  {allNotes.map((note) => (
                    <ToggleGroupItem key={note} value={note} variant={"outline"}>
                      {note}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
