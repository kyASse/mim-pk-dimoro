import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import ProgramDetails from "@/components/program/ProgramDetails";
import ExtraActivity from "@/components/program/ExtraActivity";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, ChevronRight, Phone, Star } from "lucide-react";
import { SCHOOL_NAME, SCHOOL_FULL_NAME } from "@/lib/school-config";

export default function Program() {
    return (
        <div className="min-h-screen">
            <PageHeader 
                title="Program & Pendidikan"
                description={`Mengenal kurikulum dan program unggulan di ${SCHOOL_NAME}`}
                background="bg-accent/20"
            />

            {/* Ikhtisar Program */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6"> Kurikulum & Program</h2>
                            <p className="text-muted-foreground mb-6">
                                {SCHOOL_FULL_NAME} menyelenggarakan pendidikan dasar dengan Kurikulum Merdeka yang diperkaya dengan muatan lokal Al-Islam, Kemuhammadiyahan, dan Bahasa Arab (ISMUBA).
                                Kami berkomitmen mencetak generasi yang unggul secara akademik dan kokoh secara spiritual.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="mt-1 bg-accent/20 p-2 rounded-full">
                                        <BookOpen className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Kurikulum Terpadu</h3>
                                        <p className="text-muted-foreground">Integrasi Kurikulum Nasional dengan nilai-nilai Keislaman.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 bg-primary/20 p-2 rounded-full">
                                        <Star className="h-5 w-5 text-primary-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Program Unggulan</h3>
                                        <p className="text-muted-foreground">Fokus pada Tahfidz Al-Qur'an dan pembentukan karakter Islami.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 bg-highlight/40 p-2 rounded-full">
                                        <Award className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Pendidik Berkompeten</h3>
                                        <p className="text-muted-foreground">Dibimbing oleh guru-guru yang berdedikasi dan ahli di bidangnya.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary rounded-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent rounded-full -z-10"></div>
                            <Image
                                src="https://placehold.co/600x400/059669/ffffff?text=Program+Pendidikan"
                                alt={`Kegiatan di ${SCHOOL_NAME}`}
                                width={600}
                                height={400}
                                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Kelas */}
            <section className="py-16 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Struktur Kurikulum</h2>
                
                    <Tabs defaultValue="kelas-bawah" className="max-w-5xl mx-auto">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="kelas-bawah">Kelas Bawah (1-3)</TabsTrigger>
                            <TabsTrigger value="kelas-atas">Kelas Atas (4-6)</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="kelas-bawah">
                            <ProgramDetails 
                                title="Fase A & B (Kelas 1-3)"
                                description="Fokus pada penguatan literasi dasar, numerasi, dan pembiasaan adab serta ibadah harian."
                                imageUrl="https://placehold.co/800x600/10b981/ffffff?text=Kelas+Bawah+1-3"
                                schedule={[
                                    { day: "Senin - Kamis", hours: "07:00 - 13:00 WIB" },
                                    { day: "Jumat", hours: "07:00 - 11:00 WIB" }
                                ]}
                                features={[
                                    "ISMUBA (Al-Qur'an Hadis, Akidah Akhlak, Fikih, Bahasa Arab)",
                                    "Pendidikan Pancasila & Bahasa Indonesia",
                                    "Matematika & Seni Budaya",
                                    "PJOK & Muatan Lokal",
                                    "Pembiasaan Sholat Dhuha & Dzuhur Berjamaah",
                                    "Tahfidz Juz 30"
                                ]}
                            />
                        </TabsContent>
                        
                        <TabsContent value="kelas-atas">
                            <ProgramDetails 
                                title="Fase B & C (Kelas 4-6)"
                                description="Pengembangan kemampuan berpikir kritis, kemandirian, dan persiapan menuju jenjang pendidikan menengah."
                                imageUrl="https://placehold.co/800x600/059669/ffffff?text=Kelas+Atas+4-6"
                                schedule={[
                                    { day: "Senin - Kamis", hours: "07:00 - 14:00 WIB" },
                                    { day: "Jumat", hours: "07:00 - 11:00 WIB" }
                                ]}
                                features={[
                                    "Mata Pelajaran Dasar + SKI (Sejarah Kebudayaan Islam)",
                                    "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
                                    "Bahasa Inggris & Teknologi Informasi (Koding)",
                                    "Penyelesaian Target Tahfidz Al-Qur'an",
                                    "Latihan Kepemimpinan & Organisasi Dasar",
                                    "Bimbingan Persiapan Ujian Akhir"
                                ]}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Ekstrakurikuler */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Ekstrakurikuler</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Mengembangkan minat, bakat, dan potensi diri siswa di luar jam pelajaran akademik.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ExtraActivity 
                            title="Tapak Suci"
                            description="Seni bela diri khas Muhammadiyah untuk melatih ketangkasan, kedisiplinan, dan keberanian."
                            icon="shield"
                            schedule="Sabtu, 08:00 - 10:00 WIB"
                            imageUrl="https://placehold.co/600x400/059669/ffffff?text=Tapak+Suci"
                        />
                        <ExtraActivity 
                            title="Hizbul Wathan (HW)"
                            description="Kepanduan Islami untuk membentuk jiwa kepemimpinan, kemandirian, dan cinta tanah air."
                            icon="users"
                            schedule="Jumat, 14:00 - 16:00 WIB"
                            imageUrl="https://placehold.co/600x400/10b981/ffffff?text=Hizbul+Wathan"
                        />
                        <ExtraActivity 
                            title="Tahfidz Qur'an"
                            description="Program khusus bagi siswa yang ingin mendalami dan menambah hafalan Al-Qur'an secara intensif."
                            icon="book"
                            schedule="Selasa & Kamis, 14:00 - 15:30 WIB"
                            imageUrl="https://placehold.co/600x400/34d399/ffffff?text=Tahfidz+Quran"
                        />
                        <ExtraActivity 
                            title="Seni & Drumband"
                            description="Pengembangan kreativitas melalui musik, olah vokal, dan seni pertunjukan."
                            icon="music"
                            schedule="Rabu, 14:00 - 16:00 WIB"
                            imageUrl="https://placehold.co/600x400/6ee7b7/ffffff?text=Seni+Musik"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ingin Tahu Lebih Lanjut?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Dapatkan informasi lengkap mengenai kurikulum, biaya pendidikan, dan prosedur pendaftaran dengan menghubungi tim admin kami.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/kontak">
                            <Button className="rounded-full bg-primary hover:bg-primary/80 text-primary-foreground">
                                Hubungi Kami <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/pendaftaran">
                            <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                                <Phone className="mr-2 h-5 w-5"/> Daftar Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
