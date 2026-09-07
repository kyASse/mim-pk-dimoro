"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  UserCheck,
  BookOpen,
  FileText,
  PhoneCall,
  ArrowLeft,
  ExternalLink,
  Save,
  CheckCircle2,
} from "lucide-react";
import { TabBeranda } from "./TabBeranda";
import { TabProfil } from "./TabProfil";
import { TabProgram } from "./TabProgram";
import { TabPPDB } from "./TabPPDB";
import { TabKontakFAQ } from "./TabKontakFAQ";
import {
  HeroContent,
  BerandaKeunggulanContent,
  HeadmasterContent,
  VisionMissionContent,
  SchoolIdentityContent,
  ProgramKurikulumContent,
  PPDBFlowContent,
  FAQItem,
  MainStatItem,
  EkstrakurikulerItem,
} from "@/lib/types/content";

interface AdminKontenHubProps {
  hero: HeroContent;
  keunggulan: BerandaKeunggulanContent;
  stats: MainStatItem[];
  headmaster: HeadmasterContent;
  visionMission: VisionMissionContent;
  identity: SchoolIdentityContent;
  program: ProgramKurikulumContent;
  eskul: EkstrakurikulerItem[];
  ppdbFlow: PPDBFlowContent;
  persyaratanText: string;
  jadwalText: string;
  sppText: string;
  kontak: any;
  faqList: FAQItem[];
}

export function AdminKontenHub({
  hero,
  keunggulan,
  stats,
  headmaster,
  visionMission,
  identity,
  program,
  eskul,
  ppdbFlow,
  persyaratanText,
  jadwalText,
  sppText,
  kontak,
  faqList,
}: AdminKontenHubProps) {
  const [activeTab, setActiveTab] = useState("beranda");

  return (
    <div className="space-y-6 pb-28 lg:pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Page Hub CMS
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Sistem Aktif & Terintegrasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Manajemen Konten Publik
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Kelola teks, foto banner, kurikulum, alur PPDB, dan kontak publik sekolah dari satu pusat kendali.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild className="h-9 text-xs">
            <Link href="/" target="_blank">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Lihat Website
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-9 text-xs">
            <Link href="/admin">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Hub */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Horizontal Swipeable Pill Tabs */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <TabsList className="inline-flex h-11 items-center bg-gray-100/80 p-1 rounded-xl text-gray-600 w-max min-w-full sm:min-w-0">
            <TabsTrigger
              value="beranda"
              className="shrink-0 whitespace-nowrap min-w-max px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              1. Beranda
            </TabsTrigger>

            <TabsTrigger
              value="profil"
              className="shrink-0 whitespace-nowrap min-w-max px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              2. Profil & Sambutan
            </TabsTrigger>

            <TabsTrigger
              value="program"
              className="shrink-0 whitespace-nowrap min-w-max px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              3. Program & Ekskul
            </TabsTrigger>

            <TabsTrigger
              value="ppdb"
              className="shrink-0 whitespace-nowrap min-w-max px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              4. PPDB & Dokumen
            </TabsTrigger>

            <TabsTrigger
              value="kontak-faq"
              className="shrink-0 whitespace-nowrap min-w-max px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              5. Kontak & FAQ
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Beranda */}
        <TabsContent value="beranda" className="space-y-6 focus-visible:outline-none">
          <TabBeranda
            initialHero={hero}
            initialKeunggulan={keunggulan}
            initialStats={stats}
          />
        </TabsContent>

        {/* Tab 2: Profil & Sambutan */}
        <TabsContent value="profil" className="space-y-6 focus-visible:outline-none">
          <TabProfil
            initialHeadmaster={headmaster}
            initialVisionMission={visionMission}
            initialIdentity={identity}
          />
        </TabsContent>

        {/* Tab 3: Program & Ekskul */}
        <TabsContent value="program" className="space-y-6 focus-visible:outline-none">
          <TabProgram
            initialProgram={program}
            initialEskul={eskul}
          />
        </TabsContent>

        {/* Tab 4: PPDB & Dokumen */}
        <TabsContent value="ppdb" className="space-y-6 focus-visible:outline-none">
          <TabPPDB
            initialFlow={ppdbFlow}
            initialPersyaratanText={persyaratanText}
            initialJadwalText={jadwalText}
            initialSppText={sppText}
          />
        </TabsContent>

        {/* Tab 5: Kontak & FAQ */}
        <TabsContent value="kontak-faq" className="space-y-6 focus-visible:outline-none">
          <TabKontakFAQ
            initialKontak={kontak}
            initialFAQ={faqList}
          />
        </TabsContent>
      </Tabs>

      {/* Sticky Floating Bottom Action Dock (Mobile Only) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 p-3 lg:hidden flex items-center justify-between shadow-2xl safe-bottom">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border-emerald-300">
            Tab {activeTab.toUpperCase()}
          </Badge>
          <span className="text-[11px] text-gray-500">Gunakan tombol simpan di tiap seksi</span>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            // Trigger simpan pada seksi aktif jika ada form submit
            const saveBtn = document.querySelector('button[type="button"].bg-emerald-600') as HTMLButtonElement;
            if (saveBtn) saveBtn.click();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-9 px-4 shadow-sm"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Simpan
        </Button>
      </div>
    </div>
  );
}
