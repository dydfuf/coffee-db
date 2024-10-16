"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface Props extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function ActiveLink({ href, className, ...rest }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(className, { "text-foreground": isActive })}
      {...rest}
    />
  );
}
