"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PendaftarHeroCard from "./PendaftarHeroCard";
import PendaftarTabsContent from "./PendaftarTabsContent";
import PendaftarWhatsAppModal from "@/components/admin/PendaftarWhatsAppModal";

interface DetailPendaftarClientProps {
  pendaftar: any;
  regId: string;
}

export default function DetailPendaftarClient({
  pendaftar,
  regId,
}: DetailPendaftarClientProps) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link href="/admin/pendaftar">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pendaftar
          </Button>
        </Link>
      </div>

      {/* Hero Summary & Quick Action Card */}
      <PendaftarHeroCard
        pendaftar={pendaftar}
        regId={regId}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* 4-Tab Organized Content */}
      <PendaftarTabsContent pendaftar={pendaftar} />

      {/* Interactive WhatsApp Dispatch Modal */}
      <PendaftarWhatsAppModal
        open={isWhatsAppOpen}
        onOpenChange={setIsWhatsAppOpen}
        recipients={[pendaftar]}
      />
    </div>
  );
}
