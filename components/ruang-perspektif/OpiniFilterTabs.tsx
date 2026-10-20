"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const PERAN_FILTER_OPTIONS = [
  { value: "semua", label: "Semua Peran" },
  { value: "guru", label: "Guru & Tendik" },
  { value: "wali_murid", label: "Wali Murid" },
  { value: "alumni", label: "Alumni" },
  { value: "umum", label: "Pemerhati Umum" },
];

export default function OpiniFilterTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPeran = searchParams.get("peran") || "semua";

  const handleSelectPeran = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "semua") {
      params.delete("peran");
    } else {
      params.set("peran", val);
    }
    router.push(`${pathname}?${params.toString()}#koleksi-opini`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {PERAN_FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelectPeran(opt.value)}
          className={cn(
            "shrink-0 whitespace-nowrap min-w-max px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border",
            currentPeran === opt.value
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
