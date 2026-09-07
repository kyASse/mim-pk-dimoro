"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
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

export const CONTENT_TABS = [
  {
    id: "beranda",
    number: "1",
    shortLabel: "Beranda",
    fullLabel: "1. Beranda",
    icon: Sparkles,
    description: "Hero banner, 4 angka statistik, dan bento pilar keunggulan",
  },
  {
    id: "profil",
    number: "2",
    shortLabel: "Profil",
    fullLabel: "2. Profil & Sambutan",
    icon: UserCheck,
    description: "Sambutan Kepala Madrasah, Visi-Misi-Motto, & legalitas",
  },
  {
    id: "program",
    number: "3",
    shortLabel: "Program",
    fullLabel: "3. Program & Ekskul",
    icon: BookOpen,
    description: "Pengantar kurikulum, jam KBM per fase, & kegiatan ekskul",
  },
  {
    id: "ppdb",
    number: "4",
    shortLabel: "PPDB",
    fullLabel: "4. PPDB & Dokumen",
    icon: FileText,
    description: "Formulir PDF, syarat berkas, jadwal gelombang, SPP, & alur",
  },
  {
    id: "kontak-faq",
    number: "5",
    shortLabel: "Kontak",
    fullLabel: "5. Kontak & FAQ",
    icon: PhoneCall,
    description: "Kontak kantor, jam operasional, maps, & daftar tanya-jawab",
  },
] as const;

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
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const activeTabIndex = CONTENT_TABS.findIndex((t) => t.id === activeTab);
  const currentTab = CONTENT_TABS[activeTabIndex >= 0 ? activeTabIndex : 0];
  const prevTab = activeTabIndex > 0 ? CONTENT_TABS[activeTabIndex - 1] : null;
  const nextTab = activeTabIndex < CONTENT_TABS.length - 1 ? CONTENT_TABS[activeTabIndex + 1] : null;

  // Auto-scroll active pill into view when tab changes
  useEffect(() => {
    if (!tabsListRef.current) return;
    const activeBtn = tabsListRef.current.querySelector<HTMLElement>(`[data-state="active"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  return (
    <div className="space-y-6 pb-28 lg:pb-10">
      {/* Header Section */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Page Hub CMS
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Sistem Aktif & Terintegrasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Konten Publik
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Kelola teks, foto banner, kurikulum, alur PPDB, dan kontak publik sekolah dari satu pusat kendali.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <Button variant="outline" size="sm" asChild className="h-9 text-xs border-border/80 hover:bg-muted/50">
            <Link href="/" target="_blank">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Lihat Website
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-9 text-xs border-border/80 hover:bg-muted/50">
            <Link href="/admin">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Hub */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        {/* MOBILE VIEW: Interactive Tab Selector Card with Bottom Sheet (sm:hidden) */}
        <div className="sm:hidden">
          <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-emerald-500/40 active:scale-[0.99] transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                    <currentTab.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Tab {currentTab.number} dari {CONTENT_TABS.length}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-foreground truncate">
                      {currentTab.fullLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pl-2 shrink-0">
                  <span className="text-xs text-muted-foreground font-medium">Ganti</span>
                  <div className="w-7 h-7 rounded-lg bg-muted/60 dark:bg-muted/30 border border-border/60 flex items-center justify-center text-muted-foreground">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-0 rounded-t-3xl border-t border-border/80 bg-card max-h-[85vh] overflow-y-auto">
              <SheetHeader className="p-5 pb-3 border-b border-border/60 text-left">
                <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-3" />
                <SheetTitle className="text-lg font-bold text-foreground">
                  Pilih Seksi Konten Halaman
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Pilih salah satu dari 5 seksi konten website publik madrasah.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-2 pb-8">
                {CONTENT_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileSheetOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                        isActive
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20 shadow-xs"
                          : "bg-muted/30 dark:bg-muted/15 border-border/60 hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-card border border-border/80 text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
                            {tab.fullLabel}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* SWIPEABLE PILL TABS with Right Gradient Fade Indicator */}
        <div className="relative group">
          <div
            ref={tabsListRef}
            className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none scroll-smooth"
          >
            <TabsList className="inline-flex h-11 items-center bg-muted/60 dark:bg-muted/40 p-1 rounded-xl text-muted-foreground border border-border/60 w-max min-w-full sm:min-w-0">
              {CONTENT_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="shrink-0 whitespace-nowrap min-w-max px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-xs transition-all flex items-center gap-1.5 sm:gap-2"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="sm:hidden font-semibold">{tab.shortLabel}</span>
                    <span className="hidden sm:inline font-semibold">{tab.fullLabel}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Right Edge Gradient Fade Hint (Mobile Only: reveals content continuation) */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background via-background/60 to-transparent sm:hidden" />
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
      <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 p-3 lg:hidden flex items-center justify-between shadow-2xl safe-bottom">
        {/* Left: Sequential Tab Jumpers */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!prevTab}
            onClick={() => prevTab && setActiveTab(prevTab.id)}
            className="h-9 w-9 p-0 border-border/80 text-foreground disabled:opacity-30"
            title={prevTab ? `Sebelumnya: ${prevTab.shortLabel}` : undefined}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={() => setIsMobileSheetOpen(true)}
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg border border-border/80 bg-muted/30 dark:bg-muted/15 text-[11px] font-semibold text-foreground hover:border-emerald-500/40"
          >
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentTab.number}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{CONTENT_TABS.length}</span>
            <span className="text-xs text-muted-foreground ml-0.5 font-normal truncate max-w-[70px]">
              {currentTab.shortLabel}
            </span>
          </button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!nextTab}
            onClick={() => nextTab && setActiveTab(nextTab.id)}
            className="h-9 w-9 p-0 border-border/80 text-foreground disabled:opacity-30"
            title={nextTab ? `Selanjutnya: ${nextTab.shortLabel}` : undefined}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Primary Save Button */}
        <Button
          type="button"
          size="sm"
          onClick={() => {
            // Trigger simpan pada seksi aktif jika ada form submit
            const saveBtn = document.querySelector('button[type="button"].bg-emerald-600') as HTMLButtonElement;
            if (saveBtn) saveBtn.click();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-9 px-4 shadow-sm ml-2"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Simpan
        </Button>
      </div>
    </div>
  );
}
