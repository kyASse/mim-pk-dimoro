import { createClient } from "@/lib/supabase/server";
import NewsSpotlightModal, { NewsSpotlightItem } from "@/components/home/NewsSpotlightModal";
import HomeHero from "@/components/home/HomeHero";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import ProgramSection from "@/components/home/ProgramSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

async function fetchSpotlightNews(): Promise<NewsSpotlightItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("berita")
    .select("id, judul, ringkasan, isi_lengkap, image_url, tanggal_terbit")
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching spotlight news:", error);
    return null;
  }

  return data;
}

export default async function Home() {
  const spotlightNews = await fetchSpotlightNews();

  return (
    <main className="min-h-screen">
      <NewsSpotlightModal news={spotlightNews} />

      {/* Hero Section */}
      <HomeHero />

      {/* Stats Section */}
      <StatsSection />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* News Section */}
      <NewsSection />

      {/* Program Section */}
      <ProgramSection />

      <GalleryPreview />

      <TestimonialsSection />

      <CTASection />
    </main>
  );
}
