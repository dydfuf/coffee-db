"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

interface Props {
  allNations: string[];
  allNotes: string[];
  selectedNations: string[];
  onSelectedNationsChange: (value: string[]) => void;
  selectedNotes: string[];
  onSelectedNotesChange: (value: string[]) => void;
}

export default function CoffeeFilter({
  allNations,
  allNotes,
  selectedNations,
  onSelectedNationsChange,
  selectedNotes,
  onSelectedNotesChange,
}: Props) {
  const nationFilterButtonLabel =
    selectedNations.length > 0
      ? `나라별 필터 | ${selectedNations.join(", ")}`
      : "나라별 필터";
  const noteFilterButtonLabel =
    selectedNotes.length > 0
      ? `노트별 필터 | ${selectedNotes.join(", ")}`
      : "노트별 필터";

  const [defaultNationValue, setDefaultNationValue] = useState(selectedNations);
  const [defaultNoteValue, setDefaultNoteValue] = useState(selectedNotes);

  useEffect(() => {
    setDefaultNationValue(selectedNations);
    setDefaultNoteValue(selectedNotes);
  }, [selectedNations, selectedNotes]);

  return (
    <Accordion
      type="single"
      className="hidden md:block sticky top-[57px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      collapsible
    >
      <AccordionItem value="nation">
        <AccordionTrigger>
          <span className="line-clamp-1 whitespace-pre-wrap">
            {nationFilterButtonLabel}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2 bg-background">
            <ToggleGroup
              type="multiple"
              className="flex flex-wrap gap-2 justify-start"
              onValueChange={onSelectedNationsChange}
              defaultValue={defaultNationValue}
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
                type="multiple"
                className="flex flex-wrap gap-2 justify-start"
                onValueChange={onSelectedNotesChange}
                defaultValue={defaultNoteValue}
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
  );
}
