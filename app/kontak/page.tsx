import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Navigation,
  ExternalLink,
  ChevronRight,
  Home,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Car,
  Compass,
} from "lucide-react";
import ContactForm from "@/components/kontak/ContactForm";
import ContactFAQ, { getWhatsAppUrl } from "@/components/kontak/ContactFAQ";
import CopyAddressButton from "@/components/kontak/CopyAddressButton";
import { createClient } from "@/lib/supabase/server";
import {
  SCHOOL_NAME,
  SCHOOL_FULL_NAME,
  SCHOOL_WHATSAPP,
  SCHOOL_CONTACT_PERSON,
  SCHOOL_EMAIL,
} from "@/lib/school-config";

// Function to validate trusted domains for Google Maps embed
function isTrustedDomain(url: string | null | undefined): boolean {
  if (!url) return false;

  const trustedDomains = ["maps.google.com", "www.google.com", "google.com"];

  try {
    const urlObj = new URL(url);
    return trustedDomains.some(
      (domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith("." + domain)
    );
  } catch {
    return false;
  }
}

export default async function ContactPage() {
  const supabase = await createClient();

  // Fetch kontak sekolah data from Supabase
  const { data: kontakData, error } = await supabase
    .from("kontak_sekolah")
    .select(
      "alamat, whatsapp, email_utama, email_admin, jam_operasional, maps_embed_url"
    )
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching kontak sekolah:", error);
  }

  // Use database values or sensible defaults from school config
  const alamat =
    kontakData?.alamat ||
    "Jl. Dimoro, Dusun II, Dimoro, Kec. Sukoharjo, Kabupaten Sukoharjo, Jawa Tengah 57512";
  const whatsappNumber = kontakData?.whatsapp || SCHOOL_WHATSAPP;
  const emailUtama = kontakData?.email_utama || SCHOOL_EMAIL;
  const emailAdmin =
    kontakData?.email_admin || "info@mimpkdimoro.sch.id";
  const jamOperasional =
    kontakData?.jam_operasional ||
    "Senin – Kamis: 07.00 – 14.00 WIB\nJumat: 07.00 – 11.30 WIB\nSabtu: 07.00 – 12.30 WIB\nAhad & Libur Nasional: Tutup";

  const defaultMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.2!2d110.83!3d-7.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDEnMjQuMCJTIDExMMKwNDknNDguMCJF!5e0!3m2!1sid!2sid!4v1";

  const mapsEmbedUrl = isTrustedDomain(kontakData?.maps_embed_url)
    ? (kontakData?.maps_embed_url as string)
    : defaultMapsEmbedUrl;

  const cleanPhone = whatsappNumber.replace(/[^0-9+]/g, "");
  const waUrl = getWhatsAppUrl(
    whatsappNumber,
    `Halo Admin ${SCHOOL_NAME}, saya ingin berkonsultasi mengenai informasi madrasah & PPDB.`
  );

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SCHOOL_FULL_NAME} ${alamat}`
  )}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Hero Section Modern */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-border/40 bg-gradient-to-b from-emerald-950/10 via-emerald-900/5 to-background">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground mb-6"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Beranda</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              </li>
              <li className="font-semibold text-emerald-700 dark:text-emerald-400">
                Kontak
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Layanan & Informasi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Hubungi <span className="text-emerald-600 dark:text-emerald-400">MIM PK Dimoro</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Pintu komunikasi kami selalu terbuka bagi calon wali murid, tamu, mitra, dan seluruh masyarakat. Tim layanan informasi {SCHOOL_NAME} siap membantu menjawab segala pertanyaan Anda.
            </p>
          </div>

          {/* 2. Quick Action Bar (4 Cards) */}
          <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action 1: WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl border border-emerald-500/20 bg-card/80 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                  WhatsApp (Fatim)
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {whatsappNumber}
                </p>
              </div>
            </a>

            {/* Action 2: Telepon */}
            <a
              href={`tel:${cleanPhone}`}
              className="group p-4 rounded-2xl border border-emerald-500/20 bg-card/80 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors">
                  Telepon (Fatim)
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {whatsappNumber}
                </p>
              </div>
            </a>

            {/* Action 3: Email */}
            <a
              href={`mailto:${emailUtama}`}
              className="group p-4 rounded-2xl border border-emerald-500/20 bg-card/80 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground group-hover:text-sky-600 transition-colors">
                  Email Resmi
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  Surat & kemitraan
                </p>
              </div>
            </a>

            {/* Action 4: Directions */}
            <a
              href="#lokasi-madrasah"
              className="group p-4 rounded-2xl border border-emerald-500/20 bg-card/80 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">
                  Petunjuk Arah
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  Navigasi ke madrasah
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Contact Info Card & Contact Form */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Integrated Contact Information Card (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-card/95 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-emerald-950/5">
                {/* Accent top border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                <div className="mb-6 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Layanan Resmi</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Informasi Kontak
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Saluran resmi komunikasi & layanan informasi {SCHOOL_FULL_NAME}.
                  </p>
                </div>

                <div className="space-y-6 text-sm">
                  {/* Item 1: Alamat */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base">
                        Alamat
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {alamat}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <CopyAddressButton address={alamat} />
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 hover:bg-emerald-500/10 px-2.5 rounded-lg"
                        >
                          <a href="#lokasi-madrasah">
                            <Navigation className="w-3.5 h-3.5 mr-1" />
                            Lihat di Peta
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Item 2: Telepon & WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base">
                        Telepon & WhatsApp
                      </h3>
                      <div className="space-y-0.5 text-muted-foreground">
                        <p className="font-medium text-foreground flex items-center gap-1.5 flex-wrap">
                          <span>{whatsappNumber}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-normal">
                            a.n. {SCHOOL_CONTACT_PERSON}
                          </span>
                        </p>
                        <p className="text-xs">
                          {whatsappNumber} (Layanan WhatsApp & Telepon – a.n. {SCHOOL_CONTACT_PERSON})
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                          asChild
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5"
                        >
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Chat Sekarang
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg gap-1.5"
                        >
                          <a href={`tel:${cleanPhone}`}>
                            <Phone className="w-3.5 h-3.5" />
                            Panggil
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Item 3: Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base">
                        Email
                      </h3>
                      <div className="space-y-0.5 text-muted-foreground">
                        <p className="font-medium text-foreground">
                          {emailUtama}
                        </p>
                        {emailAdmin && emailAdmin !== emailUtama && (
                          <p className="text-xs">{emailAdmin}</p>
                        )}
                      </div>
                      <div className="pt-1">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg gap-1.5"
                        >
                          <a href={`mailto:${emailUtama}`}>
                            <Mail className="w-3.5 h-3.5" />
                            Kirim Email
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Item 4: Jam Operasional */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-base">
                          Jam Operasional
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Buka Hari Kerja
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                        {jamOperasional}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Redesigned Contact Form (7 cols on lg) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section Google Maps & Panduan Akses */}
      <section
        id="lokasi-madrasah"
        className="py-14 md:py-20 border-t border-border/40 bg-muted/20 scroll-mt-16"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide">
              <Compass className="w-3.5 h-3.5" />
              <span>Akses & Navigasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Lokasi Madrasah & Panduan Rute
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kunjungi kampus {SCHOOL_NAME} dengan mudah melalui panduan rute dan navigasi langsung berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive Responsive Map Embed (8 cols on lg) */}
            <div className="lg:col-span-8 rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-card overflow-hidden shadow-lg min-h-[380px] lg:min-h-[440px]">
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[380px] lg:min-h-[440px]"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Lokasi ${SCHOOL_NAME}`}
              />
            </div>

            {/* Side Info & Navigation Guide Panel (4 cols on lg) */}
            <div className="lg:col-span-4 rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-card/95 p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Panduan Akses Madrasah
                </h3>

                {/* Point 1 */}
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block text-xs uppercase tracking-wide">
                      Alamat Terverifikasi
                    </strong>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      {alamat}
                    </span>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3 text-sm">
                  <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block text-xs uppercase tracking-wide">
                      Akses Kendaraan
                    </strong>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      Jalan mulus beraspal, dapat dilalui motor, mobil, dan bus mini dengan area parkir yang tertata dan aman.
                    </span>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block text-xs uppercase tracking-wide">
                      Waktu Kunjungan
                    </strong>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      Disarankan berkunjung pada pukul 08.00 – 13.00 WIB untuk konsultasi langsung bersama tim madrasah.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  asChild
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md gap-2"
                >
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Buka Navigasi Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                  </a>
                </Button>

                <CopyAddressButton address={alamat} className="w-full h-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Integrasi FAQ Section */}
      <ContactFAQ className="border-t border-border/40" />
    </div>
  );
}