import { COMPETENT_EDUCATORS } from "@/lib/school-data";
import { GraduationCap, Award, CheckCircle } from "lucide-react";

export default function EducatorsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <GraduationCap className="w-4 h-4" />
            <span>Pendidik & Tenaga Kependidikan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {COMPETENT_EDUCATORS.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {COMPETENT_EDUCATORS.description}
          </p>
        </div>

        {/* 8 Educator Programs Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Program Pengembangan & Peningkatan Kualitas Guru</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPETENT_EDUCATORS.programs.map((program, index) => (
              <div
                key={index}
                className="bg-background border border-border/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-foreground/90 leading-snug">
                  {program}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Guru Commitments List */}
        <div className="bg-background border border-primary/20 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Komitmen Pendidik MIM PK Dimoro</h3>
              <p className="text-sm text-muted-foreground">Prinsip dan nilai utama yang dipegang teguh oleh seluruh tim pendidik.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPETENT_EDUCATORS.commitments.map((commitment, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-card border border-border flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground/80 leading-snug">
                  {commitment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
