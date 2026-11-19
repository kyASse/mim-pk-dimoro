"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Calendar, GraduationCap, Users } from "lucide-react";
import type {
  PersonilOrganisasi,
  SlotJabatan,
  StrukturOrganisasiContent,
} from "@/lib/types/content";
import { groupWaliKelasByGrade } from "@/lib/utils/struktur-organisasi";
import PageHeader from "@/components/shared/PageHeader";
import OrgNodeCard from "@/components/struktur-organisasi/OrgNodeCard";
import { cn } from "@/lib/utils";

export interface StrukturOrganisasiClientProps {
  content: StrukturOrganisasiContent;
}

type OrgFilterKey = "semua" | "pimpinan" | "wali_kelas" | "guru_mapel";

const FILTER_OPTIONS: ReadonlyArray<{ id: OrgFilterKey; label: string }> = [
  { id: "semua", label: "Semua" },
  { id: "pimpinan", label: "Pimpinan & Staf" },
  { id: "wali_kelas", label: "Wali Kelas" },
  { id: "guru_mapel", label: "Guru Mapel" },
];

function VerticalSpine({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("w-0.5 h-8 bg-primary/30 mx-auto", className)}
    />
  );
}

interface BusbarConnectorsProps {
  isFirst: boolean;
  isLast: boolean;
}

function BusbarConnectors({ isFirst, isLast }: BusbarConnectorsProps) {
  return (
    <>
      {!isFirst && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-1/2 h-0.5 bg-primary/30"
        />
      )}
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 right-0 h-0.5 bg-primary/30"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/30"
      />
    </>
  );
}

interface SpineBranchRowProps {
  slots: SlotJabatan[];
  personil: PersonilOrganisasi[];
}

/**
 * Merender cabang simetris kiri/kanan pada poros tengah (atau busbar adaptif jika != 2 item).
 */
function SpineBranchRow({ slots, personil }: SpineBranchRowProps) {
  if (slots.length === 0) {
    return null;
  }

  if (slots.length === 2) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center max-w-3xl mx-auto">
        <div className="flex items-center justify-end">
          <OrgNodeCard
            slot={slots[0]}
            personil={personil}
            variant="default"
            className="w-full max-w-[220px]"
          />
          <div
            aria-hidden="true"
            className="h-0.5 w-8 xl:w-12 bg-primary/30 shrink-0"
          />
        </div>

        <div
          aria-hidden="true"
          className="flex flex-col items-center self-stretch justify-center"
        >
          <div className="w-0.5 flex-1 bg-primary/30" />
          <div className="size-2.5 rounded-full bg-primary/45 ring-4 ring-primary/10 shrink-0" />
          <div className="w-0.5 flex-1 bg-primary/30" />
        </div>

        <div className="flex items-center justify-start">
          <div
            aria-hidden="true"
            className="h-0.5 w-8 xl:w-12 bg-primary/30 shrink-0"
          />
          <OrgNodeCard
            slot={slots[1]}
            personil={personil}
            variant="default"
            className="w-full max-w-[220px]"
          />
        </div>
      </div>
    );
  }

  const colCount = Math.min(slots.length, 4);
  return (
    <div
      className="grid gap-4 max-w-4xl mx-auto"
      style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
    >
      {slots.map((slot, index) => (
        <div key={slot.id} className="relative flex flex-col items-center pt-6">
          {index < colCount && (
            <BusbarConnectors
              isFirst={index === 0}
              isLast={index === Math.min(slots.length, colCount) - 1}
            />
          )}
          <OrgNodeCard
            slot={slot}
            personil={personil}
            variant="default"
            className="w-full max-w-[220px]"
          />
        </div>
      ))}
    </div>
  );
}

interface TierSectionProps {
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}

function TierSection({ title, ariaLabel, children }: TierSectionProps) {
  return (
    <section aria-label={ariaLabel}>
      <div className="flex items-center gap-2.5 mb-3">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full bg-primary shrink-0"
        />
        <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="border-l-2 border-primary/25 pl-4 space-y-4">
        {children}
      </div>
    </section>
  );
}

interface OrgLandmarkPillProps {
  label: string;
  variant: "dewan" | "siswa";
  compact?: boolean;
}

function OrgLandmarkPill({
  label,
  variant,
  compact = false,
}: OrgLandmarkPillProps) {
  const Icon = variant === "dewan" ? Users : GraduationCap;
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full font-bold",
          compact ? "px-5 py-2 text-xs sm:text-sm" : "px-6 py-2.5 text-sm",
          variant === "dewan"
            ? "bg-primary text-primary-foreground shadow-sm border border-primary/20"
            : "bg-amber-500/15 border-2 border-amber-500/35 text-amber-900 dark:text-amber-200 shadow-2xs"
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}

/**
 * StrukturOrganisasiClient
 * Tampilan publik interaktif bagan struktur organisasi madrasah:
 * - Desktop: hierarki tree dengan tulang punggung (spine) & busbar CSS.
 * - Mobile & Mode Filter: kartu berjenjang dengan garis penghubung kiri & filter cepat.
 */
export default function StrukturOrganisasiClient({
  content,
}: StrukturOrganisasiClientProps) {
  const [activeFilter, setActiveFilter] = useState<OrgFilterKey>("semua");
  const shouldReduceMotion = useReducedMotion();

  const waliGroups = useMemo(
    () => groupWaliKelasByGrade(content.wali_kelas),
    [content.wali_kelas]
  );

  const wakaCols = Math.min(Math.max(content.waka.length, 1), 6);
  const waliCols = Math.min(Math.max(waliGroups.length, 1), 6);
  const guruMapelCols = Math.min(Math.max(content.guru_mapel.length, 1), 5);

  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" as const };

  const showPimpinan = activeFilter === "semua" || activeFilter === "pimpinan";
  const showWaliKelas = activeFilter === "semua" || activeFilter === "wali_kelas";
  const showGuruMapel = activeFilter === "semua" || activeFilter === "guru_mapel";

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <PageHeader
        title={content.hero.judul}
        description={content.hero.subjudul}
        badge={content.hero.badge}
        background="bg-primary/15 dark:bg-primary/20"
      >
        {content.hero.tahun_ajaran && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-primary/10 border border-primary/25 text-primary shadow-2xs backdrop-blur-xs">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{content.hero.tahun_ajaran}</span>
          </div>
        )}
      </PageHeader>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-10">
        {/* Quick Filter Pill Bar */}
        <div
          role="group"
          aria-label="Filter bagian struktur organisasi"
          className="flex items-center gap-2 overflow-x-auto py-1 sm:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(option.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap min-w-max px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border/70 hover:text-foreground hover:border-primary/40"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Desktop Full Tree (hanya aktif ketika filter === "semua") */}
        {activeFilter === "semua" && (
          <motion.section
            data-testid="org-tree-desktop"
            aria-label="Bagan Struktur Organisasi Lengkap"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition}
            className="hidden lg:block"
          >
            <div className="rounded-3xl border border-border/60 bg-card/40 p-8 xl:p-10 shadow-2xs">
              {/* Row 1: Komite Madrasah (kiri) -- Kamad Spotlight (tengah) */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
                <div className="flex items-center justify-end pr-0">
                  <OrgNodeCard
                    slot={content.komite}
                    personil={content.personil}
                    variant="partner"
                    className="w-full max-w-[260px]"
                  />
                  <div
                    aria-hidden="true"
                    className="w-8 xl:w-14 border-t-2 border-dashed border-primary/40 shrink-0"
                  />
                </div>

                <div className="flex justify-center">
                  <OrgNodeCard
                    slot={content.kamad}
                    personil={content.personil}
                    variant="spotlight"
                    className="w-[260px]"
                  />
                </div>

                <div aria-hidden="true" />
              </div>

              <VerticalSpine />

              {/* Row 2: Administrasi (TU & Bendahara) bercabang dari poros tengah */}
              <SpineBranchRow
                slots={content.administrasi}
                personil={content.personil}
              />

              {content.administrasi.length > 0 && <VerticalSpine />}

              {/* Row 3: Waka Columns dengan busbar horizontal & optional sub_unit */}
              {content.waka.length > 0 && (
                <>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${wakaCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {content.waka.map((wakaSlot, index) => (
                      <div
                        key={wakaSlot.id}
                        className="relative flex flex-col items-center pt-6"
                      >
                        {content.waka.length > 1 ? (
                          <BusbarConnectors
                            isFirst={index === 0}
                            isLast={index === content.waka.length - 1}
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/30"
                          />
                        )}

                        <OrgNodeCard
                          slot={wakaSlot}
                          personil={content.personil}
                          variant="default"
                          className="w-full"
                        />

                        {wakaSlot.sub_unit && (
                          <>
                            <div
                              aria-hidden="true"
                              className="w-0.5 h-6 bg-primary/30"
                            />
                            <OrgNodeCard
                              slot={wakaSlot.sub_unit}
                              personil={content.personil}
                              variant="compact"
                              className="w-full"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <VerticalSpine />
                </>
              )}

              {/* Row 4: Penunjang (Koor. Kop. Siswa & Penjaga Sekolah) */}
              <SpineBranchRow
                slots={content.penunjang}
                personil={content.personil}
              />

              {content.penunjang.length > 0 && <VerticalSpine />}

              {/* Row 5: Wali Kelas dikelompokkan per tingkat (I..VI) */}
              {waliGroups.length > 0 && (
                <>
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${waliCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {waliGroups.map((group, index) => (
                      <div
                        key={group.grade}
                        className="relative flex flex-col items-center pt-6"
                      >
                        {waliGroups.length > 1 ? (
                          <BusbarConnectors
                            isFirst={index === 0}
                            isLast={index === waliGroups.length - 1}
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/30"
                          />
                        )}

                        <span className="mb-2 inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          Kelas {group.grade}
                        </span>

                        <div className="w-full flex flex-col items-center">
                          {group.slots.map((waliSlot, slotIdx) => (
                            <React.Fragment key={waliSlot.id}>
                              {slotIdx > 0 && (
                                <div
                                  aria-hidden="true"
                                  className="w-0.5 h-4 bg-primary/25 mx-auto"
                                />
                              )}
                              <OrgNodeCard
                                slot={waliSlot}
                                personil={content.personil}
                                variant="compact"
                                className="w-full"
                              />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <VerticalSpine />
                </>
              )}

              {/* Row 6: Simpul Dewan Guru */}
              <OrgLandmarkPill label={content.dewan_guru_label} variant="dewan" />

              {/* Row 7: Guru Mapel (mendukung jumlah dinamis, 5 atau 7+) */}
              {content.guru_mapel.length > 0 && (
                <>
                  <VerticalSpine />
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${guruMapelCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {content.guru_mapel.map((mapelSlot, index) => {
                      const isTopRow = index < guruMapelCols;
                      return (
                        <div
                          key={mapelSlot.id}
                          className={cn(
                            "relative flex flex-col items-center",
                            isTopRow ? "pt-6" : "pt-1"
                          )}
                        >
                          {isTopRow &&
                            (guruMapelCols > 1 ? (
                              <BusbarConnectors
                                isFirst={index === 0}
                                isLast={index === guruMapelCols - 1}
                              />
                            ) : (
                              <div
                                aria-hidden="true"
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/30"
                              />
                            ))}
                          <OrgNodeCard
                            slot={mapelSlot}
                            personil={content.personil}
                            variant="compact"
                            className="w-full"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Row 8: Simpul Terminal Siswa */}
              <VerticalSpine />
              <OrgLandmarkPill label={content.siswa_label} variant="siswa" />
            </div>
          </motion.section>
        )}

        {/* Mobile & Filtered Tiered View */}
        <motion.div
          key={activeFilter}
          data-testid={
            activeFilter === "semua" ? "org-tree-mobile" : "org-filtered-view"
          }
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransition}
          className={cn(
            "space-y-8",
            activeFilter === "semua" ? "lg:hidden" : "block max-w-4xl mx-auto"
          )}
        >
          {showPimpinan && (
            <>
              <TierSection
                title="Pimpinan & Komite Madrasah"
                ariaLabel="Pimpinan dan Komite Madrasah"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <OrgNodeCard
                    slot={content.kamad}
                    personil={content.personil}
                    variant="spotlight"
                  />
                  <OrgNodeCard
                    slot={content.komite}
                    personil={content.personil}
                    variant="partner"
                  />
                </div>
              </TierSection>

              {content.administrasi.length > 0 && (
                <TierSection
                  title="Tata Usaha & Administrasi"
                  ariaLabel="Tata Usaha dan Administrasi"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {content.administrasi.map((slot) => (
                      <OrgNodeCard
                        key={slot.id}
                        slot={slot}
                        personil={content.personil}
                        variant="default"
                      />
                    ))}
                  </div>
                </TierSection>
              )}

              {content.waka.length > 0 && (
                <TierSection
                  title="Wakil Kepala Madrasah & Unit"
                  ariaLabel="Wakil Kepala Madrasah"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.waka.map((wakaSlot) => (
                      <div key={wakaSlot.id} className="space-y-2.5">
                        <OrgNodeCard
                          slot={wakaSlot}
                          personil={content.personil}
                          variant="default"
                        />
                        {wakaSlot.sub_unit && (
                          <div className="border-l-2 border-primary/25 pl-4 ml-4">
                            <OrgNodeCard
                              slot={wakaSlot.sub_unit}
                              personil={content.personil}
                              variant="compact"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TierSection>
              )}

              {content.penunjang.length > 0 && (
                <TierSection
                  title="Tenaga Penunjang"
                  ariaLabel="Tenaga Penunjang"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {content.penunjang.map((slot) => (
                      <OrgNodeCard
                        key={slot.id}
                        slot={slot}
                        personil={content.personil}
                        variant="default"
                      />
                    ))}
                  </div>
                </TierSection>
              )}
            </>
          )}

          {showWaliKelas && waliGroups.length > 0 && (
            <TierSection title="Wali Kelas" ariaLabel="Wali Kelas">
              <div className="space-y-5">
                {waliGroups.map((group) => (
                  <div key={group.grade} className="space-y-2.5">
                    <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                      Kelas {group.grade}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.slots.map((waliSlot) => (
                        <OrgNodeCard
                          key={waliSlot.id}
                          slot={waliSlot}
                          personil={content.personil}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TierSection>
          )}

          {activeFilter === "semua" && (
            <div className="pt-2">
              <OrgLandmarkPill
                label={content.dewan_guru_label}
                variant="dewan"
                compact
              />
            </div>
          )}

          {showGuruMapel && content.guru_mapel.length > 0 && (
            <TierSection
              title="Guru Mata Pelajaran"
              ariaLabel="Guru Mata Pelajaran"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.guru_mapel.map((slot) => (
                  <OrgNodeCard
                    key={slot.id}
                    slot={slot}
                    personil={content.personil}
                    variant="compact"
                  />
                ))}
              </div>
            </TierSection>
          )}

          {activeFilter === "semua" && (
            <div className="pt-2">
              <OrgLandmarkPill
                label={content.siswa_label}
                variant="siswa"
                compact
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
