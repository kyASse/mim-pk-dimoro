"use client"

import FeatureCard from "@/components/home/FeatureCard";

export default function FeaturesSection() {
    return (
        <section className="p-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Mengapa Memilih Kami?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                        icon="book"
                        title="Kurikulum Terpadu"
                        description="Integrasi Kurikulum Nasional dan nilai-nilai Al-Islam Kemuhammadiyahan yang komprehensif."
                        color="primary"
                    />
                    <FeatureCard 
                        icon="bookmarked"
                        title="Program Tahfidz"
                        description="Pembiasaan menghafal Al-Qur'an dengan metode yang menyenangkan bagi siswa."
                        color="accent"
                    />
                    <FeatureCard 
                        icon="brain"
                        title="Pembinaan Karakter"
                        description="Fokus pada pembentukan akhlak mulia dan kemandirian siswa sejak dini."
                        color="highlight"
                    />
                    <FeatureCard 
                        icon="activity"
                        title="Ekskul Variatif"
                        description="Berbagai kegiatan ekstrakurikuler untuk mengembangkan minat dan bakat siswa."
                        color="attention"
                    />
                </div>
            </div>
        </section>
    )
}