import Image from "next/image";
import Link from "next/link";
import { Phone, ChevronRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ValueCard from "@/components/tentang-kami/ValueCard";
import PageHeader from "@/components/shared/PageHeader";
import SchoolIdentity from "@/components/tentang-kami/SchoolIdentity";
import Achievements from "@/components/tentang-kami/Achievements";
import { SCHOOL_NAME, SCHOOL_FULL_NAME } from "@/lib/school-config";

export default function AboutUs() {
    return (
        <div className="min-h-screen">
            <PageHeader 
                title="Tentang Kami"
                description={`Mengenal lebih dekat ${SCHOOL_NAME}`}
                background="bg-primary/20"
            />

            {/* Visi Misi */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Visi & Misi</h2>
                            
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-2 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-primary"/> Visi
                                </h3>
                                <p className="text-muted-foreground">
                                    Mewujudkan generasi Muslim yang cerdas, berakhlak mulia, berprestasi, dan bermanfaaat bagi sesama.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-primary"/> Misi
                                </h3>
                                <ul className="list-disc text-muted-foreground space-y-2 pl-6">
                                    <li>Menyelenggarakan pendidikan dasar yang terintegrasi dengan nilai-nilai Al-Islam dan Kemuhammadiyahan.</li>
                                    <li>Mengembangkan potensi akademik dan non-akademik siswa secara optimal melalui kurikulum yang inovatif.</li>
                                    <li>Membiasakan budaya islami dalam kehidupan sehari-hari di lingkungan sekolah.</li>
                                    <li>Mendorong kreativitas dan kemandirian siswa dalam menghadapi tantangan zaman.</li>
                                    <li>Menjalin kerjasama yang harmonis dengan orang tua dan masyarakat.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-secondary rounded-full -z-10"></div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full -z-10"></div>
                            <Image 
                                src="https://placehold.co/600x600/059669/ffffff.png?text=Visi+dan+Misi"
                                alt={`Kegiatan di ${SCHOOL_NAME}`}
                                width={600}
                                height={600}
                                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

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
                                <Phone className="mr-2 h-5 w-5"/> Hubungi Kami
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
