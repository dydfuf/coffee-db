"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  buildListUrl,
  parseCriteriaFromQuery,
  type FilterCriteria,
} from "@/utils/coffee-filters";

export function useCoffeeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const criteria: FilterCriteria = parseCriteriaFromQuery(
    searchParams.get("nation"),
    searchParams.get("note")
  );

  const setNations = (nations: string[]) => {
    const next = buildListUrl({ ...criteria, nations });
    router.replace(next);
  };

  const setNotes = (notes: string[]) => {
    const next = buildListUrl({ ...criteria, notes });
    router.replace(next);
  };

  // 새로 추가: 모든 필터 초기화
  const clearFilters = () => {
    const next = buildListUrl({ nations: [], notes: [] });
    router.replace(next);
  };

  const nationFilterButtonLabel =
    criteria.nations.length > 0
      ? `나라별 필터 | ${criteria.nations.join(", ")}`
      : "나라별 필터";
  const noteFilterButtonLabel =
    criteria.notes.length > 0
      ? `노트별 필터 | ${criteria.notes.join(", ")}`
      : "노트별 필터";

  return {
    criteria,
    setNations,
    setNotes,
    clearFilters,
    nationFilterButtonLabel,
    noteFilterButtonLabel,
  } as const;
}