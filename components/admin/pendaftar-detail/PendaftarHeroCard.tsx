"use client";

import PendaftarDossierHeader from "./PendaftarDossierHeader";
import PendaftarInspectorSidebar from "./PendaftarInspectorSidebar";

export interface PendaftarHeroProps {
  pendaftar: any;
  regId: string;
  onOpenWhatsApp: () => void;
  onStatusChange?: (newStatus: string) => void;
}

export default function PendaftarHeroCard({
  pendaftar,
  regId,
  onOpenWhatsApp,
}: PendaftarHeroProps) {
  return (
    <div className="space-y-4">
      <PendaftarDossierHeader pendaftar={pendaftar} regId={regId} />
      <div className="lg:hidden">
        <PendaftarInspectorSidebar
          pendaftar={pendaftar}
          onOpenWhatsApp={onOpenWhatsApp}
        />
      </div>
    </div>
  );
}
