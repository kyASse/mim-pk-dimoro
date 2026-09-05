"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PendaftarDossierHeader from "./PendaftarDossierHeader";
import PendaftarDossierCanvas from "./PendaftarDossierCanvas";
import PendaftarInspectorSidebar from "./PendaftarInspectorSidebar";
import PendaftarMobileActionBar from "./PendaftarMobileActionBar";
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
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-24 sm:pb-28 lg:pb-12">
      {/* Top Breadcrumb Link */}
      <div className="flex items-center justify-between">
        <Link href="/admin/pendaftar">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground -ml-2 h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Daftar Pendaftar
          </Button>
        </Link>
      </div>

      {/* Main Student Identity Header (includes Mobile Status Trigger) */}
      <PendaftarDossierHeader pendaftar={pendaftar} regId={regId} />

      {/* 2-Column Operational Dossier Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Official Student Record Dossier (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <PendaftarDossierCanvas pendaftar={pendaftar} />
        </div>

        {/* Right Column: Desktop Sticky Action & Verification Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <PendaftarInspectorSidebar
            pendaftar={pendaftar}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        </div>
      </div>

      {/* Sticky Mobile Bottom Action Dock (Visible only on mobile/tablet < lg) */}
      <PendaftarMobileActionBar
        pendaftar={pendaftar}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Interactive WhatsApp Dispatch Modal */}
      <PendaftarWhatsAppModal
        open={isWhatsAppOpen}
        onOpenChange={setIsWhatsAppOpen}
        recipients={[pendaftar]}
      />
    </div>
  );
}
