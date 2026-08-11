import Image from "next/image";
import Link from "next/link";
import { Phone, ChevronRight, GraduationCap, CheckCircle2, Quote } from "lucide-react";
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
    <div className="min-h-screen">
      <PageHeader
        title="Tentang Kami"
        description={`Mengenal lebih dekat ${SCHOOL_NAME}`}
        background="bg-primary/20"
      />

      {/* Sambutan Kepala Madrasah */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Photo & Title Card */}
            <div className="lg:col-span-4 flex flex-col items-center text-center bg-card border border-border p-6 rounded-2xl shadow-sm sticky top-24">
              <div className="relative w-48 h-48 md:w-56 md:h-56 mb-5 overflow-hidden rounded-full border-4 border-primary/20 shadow-md">
                <Image
                  src={HEADMASTER_WELCOME.photoUrl}
                  alt={HEADMASTER_WELCOME.name}
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {HEADMASTER_WELCOME.name}
              </h3>
              <p className="text-sm font-medium text-primary mt-1">
                {HEADMASTER_WELCOME.title}
              </p>
              <div className="mt-4 pt-4 border-t border-border w-full text-xs text-muted-foreground italic">
                "{HEADMASTER_WELCOME.summary}"
              </div>
            </div>

            {/* Paragraphs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <Quote className="w-5 h-5" />
                <span>Sambutan Kepala Madrasah</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Selamat Datang di {SCHOOL_FULL_NAME}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                {HEADMASTER_WELCOME.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index === 0 || index === HEADMASTER_WELCOME.paragraphs.length - 1 ? "font-semibold text-foreground" : ""}>
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>Profil Lulusan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Standar Kompetensi & Karakter Lulusan
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Setiap lulusan {SCHOOL_NAME} dibina untuk memenuhi 6 pilar profil lulusan utama:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXCELLENT_PROGRAMS.graduateProfiles.map((profile, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 shadow-xs hover:border-primary/40 transition-colors flex items-start gap-4"
              >
                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    Profil {index + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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

      {/* Nilai-Nilai */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Nilai-Nilai Kami</h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Kami mengedepankan nilai-nilai Islami dan keunggulan akademik untuk membentuk karakter siswa yang tangguh.
          </p>

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

      {/* CTA */}
      <section className="py-16 bg-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Mari Bergabung dengan Kami</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Berikan pendidikan terbaik untuk masa depan buah hati Anda di {SCHOOL_FULL_NAME}.
            Hubungi kami atau kunjungi madrasah kami untuk informasi lebih lanjut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/pendaftaran"}>
              <Button className="rounded-full bg-primary hover:bg-primary/80 text-primary-foreground">
                Daftar Sekarang <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={"/kontak"}>
              <Button variant={"outline"} className="rounded-full border-primary text-primary hover:bg-primary/10">
                <Phone className="mr-2 h-5 w-5" /> Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
