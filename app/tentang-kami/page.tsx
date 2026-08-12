import Image from "next/image";
import Link from "next/link";
import { Phone, ChevronRight, GraduationCap, CheckCircle2, Quote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ValueCard from "@/components/tentang-kami/ValueCard";
import PageHeader from "@/components/shared/PageHeader";
import SchoolIdentity from "@/components/tentang-kami/SchoolIdentity";
import Achievements from "@/components/tentang-kami/Achievements";
import VisionMission from "@/components/tentang-kami/VisionMission";
import EducatorsSection from "@/components/tentang-kami/EducatorsSection";
import { SCHOOL_NAME, SCHOOL_FULL_NAME } from "@/lib/school-config";
import { HEADMASTER_WELCOME, EXCELLENT_PROGRAMS } from "@/lib/school-data";

export default function AboutUs() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <PageHeader
        title="Tentang Kami"
        description={`Mengenal lebih dekat ${SCHOOL_NAME}`}
        background="bg-primary/20"
      />

      {/* Sambutan Kepala Madrasah */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Photo & Profile Card (Mobile: Compact Card / Desktop: Sticky Editorial Card) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center bg-card border border-border/60 p-6 sm:p-8 rounded-3xl shadow-sm lg:sticky lg:top-28">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-5 overflow-hidden rounded-full border-4 border-primary/20 shadow-md">
                <Image
                  src={HEADMASTER_WELCOME.photoUrl}
                  alt={HEADMASTER_WELCOME.name}
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-foreground leading-snug">
                {HEADMASTER_WELCOME.name}
              </h3>
              <p className="text-sm font-semibold text-primary mt-1">
                {HEADMASTER_WELCOME.title}
              </p>
              
              <div className="mt-5 pt-5 border-t border-border/50 w-full text-xs sm:text-sm text-muted-foreground italic leading-relaxed bg-muted/30 p-4 rounded-2xl">
                "{HEADMASTER_WELCOME.summary}"
              </div>
            </div>

            {/* Paragraphs & Editorial Greeting */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
                <Quote className="w-4 h-4" />
                <span>Sambutan Kepala Madrasah</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Selamat Datang di {SCHOOL_FULL_NAME}
              </h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                {HEADMASTER_WELCOME.paragraphs.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={
                      index === 0 || index === HEADMASTER_WELCOME.paragraphs.length - 1 
                        ? "font-semibold text-foreground bg-muted/20 p-4 rounded-2xl border-l-4 border-primary" 
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <VisionMission />

      {/* Profil Lulusan */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              <span className="sr-only">Profil Lulusan</span>
              Standar Kompetensi & Karakter Lulusan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
              Setiap lulusan {SCHOOL_NAME} dibina untuk memenuhi 6 pilar profil lulusan utama:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXCELLENT_PROGRAMS.graduateProfiles.map((profile, index) => (
              <div
                key={index}
                className="bg-card border border-border/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-foreground text-base">
                      Profil {index + 1}
                    </h3>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Pilar {index + 1}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {profile}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educators Section */}
      <EducatorsSection />

      {/* Identitas MI */}
      <SchoolIdentity />

      {/* Nilai-Nilai Utama */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prinsip Utama</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Nilai-Nilai Kami
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Kami mengedepankan nilai-nilai Islami dan keunggulan akademik untuk membentuk karakter siswa yang tangguh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              title="Religius"
              description="Menanamkan kecintaan pada Allah dan Rasul-Nya melalui pembiasaan ibadah harian."
              icon="heart"
              color="primary"
            />
            <ValueCard
              title="Integritas"
              description="Membangun kejujuran dan tanggung jawab dalam setiap tindakan dan ucapan."
              icon="heart"
              color="highlight"
            />
            <ValueCard
              title="Cerdas"
              description="Mendorong semangat belajar dan berpikir kritis dalam menguasai ilmu pengetahuan."
              icon="brain"
              color="secondary"
            />
            <ValueCard
              title="Mandiri"
              description="Melatih kemandirian dan rasa percaya diri untuk menjadi pemimpin masa depan."
              icon="users"
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Prestasi */}
      <Achievements />

      {/* CTA PPDB */}
      <section className="py-16 md:py-24 bg-primary/20">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Mari Bergabung dengan Kami
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Berikan pendidikan terbaik untuk masa depan buah hati Anda di {SCHOOL_FULL_NAME}.
            Hubungi kami atau kunjungi madrasah kami untuk informasi pendaftaran lebih lanjut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 min-h-[44px]">
              <Link href="/pendaftaran">
                <span>Daftar PPDB Sekarang</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-primary text-primary hover:bg-primary/10 font-semibold h-12 px-8 min-h-[44px]">
              <Link href="/kontak">
                <Phone className="mr-2 h-4 w-4" />
                <span>Hubungi Kami</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
