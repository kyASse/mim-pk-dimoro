import { Metadata } from "next";
import Link from "next/link";
import { getAdminOpinions } from "@/lib/services/ruang-perspektif";
import OpiniAdminTable from "@/components/admin/ruang-perspektif/OpiniAdminTable";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meja Redaksi Ruang Perspektif | Admin MIM PK Dimoro",
};

const STATUS_TABS = [
  { value: "semua", label: "Semua" },
  { value: "menunggu_kurasi", label: "Menunggu Kurasi" },
  { value: "terbit", label: "Terbit" },
  { value: "ditolak", label: "Ditolak" },
  { value: "arsip", label: "Arsip" },
];

export default async function AdminRuangPerspektifPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status, search } = await searchParams;
  const currentStatus = status || "semua";
  const opinions = await getAdminOpinions({ status: currentStatus, search });

  const pendingCount = opinions.filter((o) => o.status === "menunggu_kurasi").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Meja Redaksi Ruang Perspektif
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kurasi, proofreading, dan penerbitan naskah opini komunitas madrasah
          </p>
        </div>
      </div>

      {/* Tabs Horizontal Mobile-Safe */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/ruang-perspektif?status=${tab.value}`}
            className={cn(
              "shrink-0 whitespace-nowrap min-w-max px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors",
              currentStatus === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.value === "menunggu_kurasi" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                {pendingCount}
              </span>
            )}
          </Link>
        ))}
      </div>

      <OpiniAdminTable items={opinions} />
    </div>
  );
}
