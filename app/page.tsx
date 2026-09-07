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
import {
  getHeroContent,
  getMainStats,
  getHeadmasterContent,
  getBerandaKeunggulanContent,
} from "@/lib/services/public-content";

async function fetchSpotlightNews(): Promise<NewsSpotlightItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("berita")
    .select("id, judul, ringkasan, isi_lengkap, image_url, tanggal_terbit")
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false })
    .limit(5);

  if (error || !data) {
    if (error) console.error("Error fetching spotlight news:", error);
    return [];
  }

  return data as NewsSpotlightItem[];
}

export default async function Home() {
  const [spotlightNews, heroContent, mainStats, headmasterContent, keunggulanContent] =
    await Promise.all([
      fetchSpotlightNews(),
      getHeroContent(),
      getMainStats(),
      getHeadmasterContent(),
      getBerandaKeunggulanContent(),
    ]);

  return (
    <main className="min-h-screen">
      <NewsSpotlightModal news={spotlightNews} />

      {/* Hero Section */}
      <HomeHero data={heroContent} />

      {/* Stats Section */}
      <StatsSection data={mainStats} />

      {/* About Section */}
      <AboutSection data={headmasterContent} />

      {/* Features Section */}
      <FeaturesSection data={keunggulanContent} />

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
