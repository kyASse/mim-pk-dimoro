import { VISION_MISSION } from "@/lib/school-data";
import { CheckCircle2, Target, HeartHandshake, Compass } from "lucide-react";

export default function VisionMission() {
  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header section with motto */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Compass className="w-4 h-4" />
            <span>Visi & Misi Madrasah</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Arah & Komitmen Pendidikan Kami
          </h2>
          <p className="text-muted-foreground italic text-lg font-medium">
            "{VISION_MISSION.motto}"
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-md shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Visi Utama</h3>
              <p className="text-lg text-foreground/90 font-medium leading-relaxed">
                {VISION_MISSION.vision}
              </p>
            </div>
          </div>
        </div>

        {/* Indicators and Missions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Indikator Visi */}
          <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 text-accent rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">7 Indikator Visi</h3>
              </div>
              <ul className="space-y-3.5">
                {VISION_MISSION.visionIndicators.map((indicator, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-secondary/20 text-secondary-foreground rounded-lg">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">8 Misi Utama</h3>
              </div>
              <ul className="space-y-3.5">
                {VISION_MISSION.missions.map((mission, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-secondary-foreground text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
