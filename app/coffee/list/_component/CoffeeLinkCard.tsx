import NoteBadge from "@/components/NoteBadge";
import { Tables } from "@/database-generated.types";
import Link from "next/link";

interface Props {
  coffeeInfo: Tables<"coffee-info">;
}

export function CoffeeLinkCard({ coffeeInfo }: Props) {
  return (
    <Link
      href={`/coffee/${coffeeInfo.id}`}
      className="flex flex-col p-8 border-[1px] rounded-lg hover:bg-accent hover:text-accent-foreground"
    >
      <div className="flex flex-col">
        <p className="text-xl">{coffeeInfo.name_kr}</p>
        <p className="text-sm text-muted-foreground">{coffeeInfo.name_en}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {coffeeInfo.notes?.map((note) => (
            <NoteBadge key={note}>{note}</NoteBadge>
          ))}
        </div>
      </div>
    </Link>
  );
}
