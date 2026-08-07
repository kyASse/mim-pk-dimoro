"use client";

import React, { useState } from "react";
import { INTEGRATED_CURRICULUM } from "@/lib/school-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Heart,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  Trophy,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PILLAR_ICONS: Record<string, React.ReactNode> = {
  akademik: <BookOpen className="h-4 w-4" />,
  "al-islam": <Heart className="h-4 w-4" />,
  kemuhammadiyahan: <Compass className="h-4 w-4" />,
  "karakter-islami": <ShieldCheck className="h-4 w-4" />,
  kepemimpinan: <Award className="h-4 w-4" />,
  "life-skill": <Sparkles className="h-4 w-4" />,
  ekstrakurikuler: <Trophy className="h-4 w-4" />,
  "pembiasaan-harian": <Clock className="h-4 w-4" />,
};

export default function IntegratedCurriculumSection() {
  const [activePillar, setActivePillar] = useState(
    INTEGRATED_CURRICULUM.pillarDetails[0]?.id || "akademik"
  );

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20" id="kurikulum-terpadu">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            <span>8 Pilar Kurikulum Terpadu</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {INTEGRATED_CURRICULUM.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {INTEGRATED_CURRICULUM.description}
          </p>
        </div>

        {/* Tabs for 8 Pillars */}
        <Tabs
          value={activePillar}
          onValueChange={setActivePillar}
          className="max-w-5xl mx-auto"
        >
          {/* Pillar Navigation Grid / Scrollable List */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2 bg-muted/60 rounded-xl mb-8">
            {INTEGRATED_CURRICULUM.pillarDetails.map((pillar) => {
              const icon = PILLAR_ICONS[pillar.id] || <BookOpen className="h-4 w-4" />;
              return (
                <TabsTrigger
                  key={pillar.id}
                  value={pillar.id}
                  className={cn(
                    "flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all",
                    "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
                  )}
                >
                  {icon}
                  <span className="truncate">{pillar.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Pillar Content Cards */}
          {INTEGRATED_CURRICULUM.pillarDetails.map((pillar) => {
            const icon = PILLAR_ICONS[pillar.id] || <BookOpen className="h-5 w-5 text-primary" />;
            return (
              <TabsContent
                key={pillar.id}
                value={pillar.id}
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                  {/* Pillar Detail Header */}
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Pilar {pillar.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  {/* Bulleted list of items */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                      Fokus & Program Kegiatan:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pillar.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-secondary/60 hover:bg-secondary/70 transition-colors"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/90 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
