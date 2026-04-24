import HomeHero from "@/components/home/HomeHero";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import ProgramSection from "@/components/home/ProgramSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HomeHero/> 

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
