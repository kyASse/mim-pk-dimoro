"use client"

import FeatureCard from "@/components/home/FeatureCard";

export default function FeaturesSection() {
    return (
        <section className="p-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Kami Menawarkan Yang Terbaik</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                        icon="book"
                        title="Kurikulum Islami"
                        description="Pendidikan terintegrasi dengan nilai-nilai islami untuk membentuk karakter anak sejak dini."
                        color="primary"
                    />
                    <FeatureCard 
                        icon="activity"
                        title="Pengembangan Motorik"
                        description="Berbagai aktivitas untuk melatih keterampilan motorik halus dan kasar anak."
                        color="accent"
                    />
                    <FeatureCard 
                        icon="brain"
                        title="Stimulasi Kognitif"
                        description="Program pembelajaran yang mendorong perkembangan intelektual anak secara optimal."
                        color="highlight"
                    />
                    <FeatureCard 
                        icon="users"
                        title="Sosialisasi Dini"
                        description="Lingkungan yang mendukung anak untuk belajar berinteraksi dan bersosialisasi"
                        color="attention"
                    />
                </div>
            </div>
        </section>
    )
}