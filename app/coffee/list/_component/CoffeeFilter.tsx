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

  return (
    <div className="hidden md:block sticky top-[57px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between py-2 px-2">
        <span className="text-sm text-muted-foreground">필터</span>
        <Button variant="ghost" size="sm" onClick={clearFilters} title="모든 필터 초기화" disabled={noActiveFilters}>
          전체 초기화
        </Button>
      </div>
      <Accordion type="single" className="" collapsible>
        <AccordionItem value="nation">
          <AccordionTrigger>
            <span className="line-clamp-1 whitespace-pre-wrap">
              {nationFilterButtonLabel}
            </span>
          </AccordionTrigger>
          <AccordionContent>
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
            <span className="line-clamp-1 whitespace-pre-wrap">
              {noteFilterButtonLabel}
            </span>
          </AccordionTrigger>
          <AccordionContent>
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
