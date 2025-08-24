import { Coffee } from "@/schema/coffee";
import { COFFEE_NOTE_DICT, getSegmentedNote } from "@/constants/coffee";

export type FilterCriteria = {
  nations: string[];
  notes: string[];
};

export const parseCriteriaFromQuery = (
  nation?: string | null,
  note?: string | null
): FilterCriteria => {
  return {
    nations: nation ? nation.split(",").filter(Boolean) : [],
    notes: note ? note.split(",").filter(Boolean) : [],
  };
};

export const buildListUrl = (criteria: FilterCriteria): string => {
  const params = new URLSearchParams();
  if (criteria.nations.length) params.set("nation", criteria.nations.join(","));
  if (criteria.notes.length) params.set("note", criteria.notes.join(","));
  const qs = params.toString();
  return `/coffee/list${qs ? `?${qs}` : ""}`;
};

export const normalizeNotes = (notes: string[]): string[] =>
  notes.map((note) => COFFEE_NOTE_DICT[note] ?? note);

const predicateByNation = (coffee: Coffee, nations: string[]) => {
  if (!nations.length) return true;
  if (!coffee.nations) return false;
  return nations.includes(coffee.nations);
};

const predicateByNotes = (coffee: Coffee, selectedNotes: string[]) => {
  if (!selectedNotes.length) return true;
  const notes = coffee.notes;
  if (!notes || notes.length === 0) return false;
  return notes.some((note) => selectedNotes.includes(COFFEE_NOTE_DICT[note] ?? note));
};

export const applyCoffeeFilters = (
  list: Coffee[],
  criteria: FilterCriteria
): Coffee[] => {
  return list
    .filter((ci) => predicateByNation(ci, criteria.nations))
    .filter((ci) => predicateByNotes(ci, criteria.notes));
};

export const computeAvailableNations = (list: Coffee[]): string[] => {
  const nations = list
    .map((ci) => ci.nations?.trim())
    .filter((n): n is string => Boolean(n));
  return Array.from(new Set(nations));
};

export const computeAvailableNotes = (
  list: Coffee[],
  criteria: FilterCriteria
): string[] => {
  const baseNations = criteria.nations.length
    ? criteria.nations
    : computeAvailableNations(list);

  const notes = list
    .filter((ci) => baseNations.includes(ci.nations ?? ""))
    .map((ci) => getSegmentedNote(ci.notes ?? []))
    .flat()
    .filter((note): note is string => Boolean(note))
    .map((note) => note.trim())
    .sort((a, b) => {
      const isAKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(a);
      const isBKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(b);

      if (isAKorean && !isBKorean) return -1;
      if (!isAKorean && isBKorean) return 1;
      return a.localeCompare(b);
    });

  return Array.from(new Set(notes));
};