import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle, PhoneCall } from "lucide-react";
import { SCHOOL_NAME, SCHOOL_WHATSAPP } from "@/lib/school-config";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const defaultFAQItems: FAQItem[] = [
  {
    id: "faq-ppdb",
    question: `Bagaimana alur dan syarat pendaftaran siswa baru (PPDB) di ${SCHOOL_NAME}?`,
    answer: `Pendaftaran dapat dilakukan secara online melalui menu Pendaftaran di website resmi atau secara langsung (offline) di kantor madrasah. Syarat pendaftaran meliputi pengisian formulir, fotokopi Akta Kelahiran, Kartu Keluarga (KK), pas foto calon peserta didik, dan dokumen pendukung lainnya jika ada. Tim panitia PPDB kami siap memandu setiap tahapan pendaftaran.`,
  },
  {
    id: "faq-kurikulum",
    question: `Kurikulum apa yang diterapkan di ${SCHOOL_NAME}?`,
    answer: `Kami mengimplementasikan Kurikulum Merdeka yang disinergikan dengan Kurikulum Ciri Khusus Muhammadiyah (ISMUBA: Al-Islam, Kemuhammadiyahan, dan Bahasa Arab). Pembelajaran diperkuat dengan pembiasaan ibadah harian seperti sholat dhuha, sholat dhuhur berjamaah, hafalan doa harian, dan pendidikan karakter Islami.`,
  },
  {
    id: "faq-biaya",
    question: `Bagaimana rincian biaya pendidikan dan infaq di ${SCHOOL_NAME}?`,
    answer: `Biaya pendidikan di madrasah kami dikelola secara transparan dan terjangkau. Rincian biaya meliputi infaq pengembangan pendidikan, seragam, modul/buku, serta SPP bulanan yang kompetitif. Kami juga menyediakan program beasiswa dan keringanan biaya bagi siswa berprestasi maupun keluarga yang membutuhkan bantuan.`,
  },
  {
    id: "faq-ekstrakurikuler",
    question: `Apa saja kegiatan ekstrakurikuler unggulan yang tersedia?`,
    answer: `MIM PK Dimoro menyediakan beragam program ekstrakurikuler unggulan untuk mengembangkan minat dan bakat siswa, di antaranya: Tahfidz Al-Qur'an (program intensif hafalan), Beladiri Tapak Suci Putra Muhammadiyah, Kepanduan Hizbul Wathan (HW), Seni Musik Drumband (Gema Surya Nada), serta klub sains dan olahraga.`,
  },
  {
    id: "faq-kunjungan",
    question: `Apakah orang tua/wali murid dapat melakukan kunjungan langsung ke madrasah?`,
    answer: `Tentu saja! Kami sangat menyambut kehadiran Bapak/Ibu untuk berkunjung (school tour), melihat fasilitas madrasah, mengamati suasana belajar, serta berkonsultasi langsung dengan kepala madrasah atau tim guru selama jam operasional kerja (Senin - Sabtu).`,
  },
];

export function getWhatsAppUrl(phone: string, text?: string): string {
  const cleanDigits = phone.replace(/[^0-9]/g, "");
  const formattedNumber = cleanDigits.startsWith("0")
    ? "62" + cleanDigits.slice(1)
    : cleanDigits;

  const defaultText = `Halo Admin ${SCHOOL_NAME}, saya ingin bertanya mengenai informasi madrasah / PPDB.`;
  const message = encodeURIComponent(text || defaultText);
  return `https://wa.me/${formattedNumber}?text=${message}`;
}

interface ContactFAQProps {
  items?: FAQItem[];
  className?: string;
}

export default function ContactFAQ({
  items = defaultFAQItems,
  className = "",
}: ContactFAQProps) {
  const waUrl = getWhatsAppUrl(SCHOOL_WHATSAPP);

  return (
    <section className={`py-12 ${className}`} aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-3 text-primary">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-foreground">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar pendaftaran PPDB, kurikulum,
            biaya, dan kegiatan di {SCHOOL_NAME}.
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b last:border-b-0 border-border/60 py-1"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:text-primary transition-colors py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Quick WhatsApp Assistance CTA */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-primary/20 p-6 md:p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Punya Pertanyaan Lain?
            </h3>
            <p className="text-sm text-muted-foreground">
              Tim layanan informasi kami siap membantu menjawab pertanyaan Anda melalui WhatsApp.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              asChild
              className="rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
            >
              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi via WhatsApp"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hubungi via WhatsApp</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
