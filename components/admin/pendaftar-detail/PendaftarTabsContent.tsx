"use client";

import PendaftarDossierCanvas from "./PendaftarDossierCanvas";

interface PendaftarTabsContentProps {
  pendaftar: any;
  defaultTab?: string;
}

export default function PendaftarTabsContent({
  pendaftar,
  defaultTab = "biodata",
}: PendaftarTabsContentProps) {
  return <PendaftarDossierCanvas pendaftar={pendaftar} defaultTab={defaultTab} />;
}
