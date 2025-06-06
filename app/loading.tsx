import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingHome() {
  return (
    <div className="mx-auto grow flex w-full">
      <div className="flex flex-col items-center w-full space-y-4 mx-[2rem]">
        <Skeleton className="h-[120px] w-[200px]" />
        <Skeleton className="h-12 w-full md:w-[40rem]" />
        <Skeleton className="h-5 w-full md:w-[400px]" />
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:w-[400px]">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
