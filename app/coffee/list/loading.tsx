import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <>
      <Skeleton className="h-[56px] md:h-[112px] w-full" />
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-[150px] w-full" />
      ))}
    </>
  );
}
