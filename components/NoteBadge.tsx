import { cn } from "@/lib/utils";
import { Badge, BadgeProps } from "@/components/ui/badge";

type Props = BadgeProps;

export default function NoteBadge({ className, ...rest }: Props) {
  return (
    <Badge
      variant={"default"}
      className={cn("text-[14px]", className)}
      {...rest}
    />
  );
}
