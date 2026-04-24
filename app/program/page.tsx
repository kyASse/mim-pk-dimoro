import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import ProgramDetails from "@/components/program/ProgramDetails";
import ActivityCard from "@/components/program/ActivityCard";
import ExtraActivity from "@/components/program/ExtraActivity";
import KalenderAkademik from "@/components/kalender/KalenderAkademik";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Calendar, ChevronRight, Phone } from "lucide-react";

export default function Program() {
    return (
        <div className="min-h-screen">
            <PageHeader 
                title="Program & Pendidikan"
                description="Mengenal program pendidikan di TK ABA Mertosanan"
                background="bg-accent/20"
            />

            {/* Ikhtisar Program */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6"> Program Pendidikan</h2>
                            <p className="text-muted-foreground mb-6">
                                TK ABA Mertosanan menyediakan program pendidikan yang komprehensif untuk mendukung perkembangan anak secara holistik.
                                Kurikulum kami dirancang untuk mengembangkan aspek kognitif, afektif, dan psikomotorik anak dengan pendekatan yang menyenangkan.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="mt-1 bg-accent/20 p-2 rounded-full">
                                        <BookOpen className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Pendidikan Berkualitas</h3>
                                        <p className="text-muted-foreground">Kurikulum nasional yang terintegrasi dengan nilai islami</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 bg-primary/20 p-2 rounded-full">
                                        <Calendar className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Jadwal Fleksibel</h3>
                                        <p className="text-muted-foreground">Jadwal pendidikan yang fleksibel sesuai dengan kebutuhan anak</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 bg-highlight/40 p-2 rounded-full">
                                        <Award className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Guru Berkualitas</h3>
                                        <p className="text-muted-foreground">Didukung oleh tenaga pendidik berkualitas yang memahami nilai-nilai islami</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary rounded-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent rounded-full -z-10"></div>
                            <Image
                                src={"https://images.pexels.com/photos/8535185/pexels-photo-8535185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                alt="Kegiatan di TK ABA Mertosanan"
                                width={600}
                                height={50}
                                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Program Kelas</h2>
                
                    <Tabs defaultValue="play-group" className="max-w-5xl mx-auto">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="play-group">
                                <span className="hidden md:inline">Kelompok Bermain</span>
                                <span className="md:hidden">KB</span>
                            </TabsTrigger>
                            <TabsTrigger value="tk-a">TK A</TabsTrigger>
                            <TabsTrigger value="tk-b">TK B</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="play-group" id="kelompok-bermain">
                            <ProgramDetails 
                                title="Kelompok Bermain (3-4 tahun)"
                                description="Program pengenalan pendidikan untuk anak usia 3-4 tahun dengan pendekatan bermain sambil belajar."
                                imageUrl="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                schedule={[
                                { day: "Senin - Jumat", hours: "07:30 - 10:30 WIB" },
                                { day: "Sabtu", hours: "07:30 - 09:30 WIB" }
                                ]}
                                features={[
                                "Pengenalan huruf hijaiyah dan doa sehari-hari",
                                "Pengembangan motorik kasar dan halus",
                                "Pengenalan konsep sederhana",
                                "Kegiatan sosial dan bermain bersama",
                                "Stimulasi kreativitas melalui seni dan musik"
                                ]}
                            />
                        </TabsContent>
                            
                        <TabsContent value="tk-a" id="tk-a">
                            <ProgramDetails 
                                title="TK A (4-5 tahun)"
                                description="Program pendidikan untuk anak usia 4-5 tahun dengan kurikulum yang mendukung perkembangan holistik."
                                imageUrl="https://images.pexels.com/photos/8535185/pexels-photo-8535185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                schedule={[
                                { day: "Senin - Jumat", hours: "07:30 - 10:45 WIB" },
                                { day: "Sabtu", hours: "07:30 - 10:00 WIB" }
                                ]}
                                features={[
                                "Pengenalan membaca Iqro dan hafalan surat pendek",
                                "Pengenalan angka dan huruf",
                                "Kegiatan seni, musik, dan gerakan kreatif",
                                "Pembelajaran tentang lingkungan sekitar",
                                "Pengembangan keterampilan sosial dan emosional"
                                ]}
                            />
                        </TabsContent>
                    
                        <TabsContent value="tk-b" id="tk-b">
                            <ProgramDetails 
                                title="TK B (5-6 tahun)"
                                description="Program persiapan masuk Sekolah Dasar untuk anak usia 5-6 tahun dengan fokus pada kemandirian."
                                imageUrl="https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                schedule={[
                                { day: "Senin - Jumat", hours: "07:30 - 11:00 WIB" },
                                { day: "Sabtu", hours: "07:30 - 10:30 WIB" }
                                ]}
                                features={[
                                "Penguatan bacaan Iqro dan hafalan surat-surat pendek",
                                "Pengembangan kemampuan membaca, menulis, dan berhitung",
                                "Penguatan keterampilan motorik halus",
                                "Pengenalan sains dan eksperimen sederhana",
                                "Persiapan fisik dan mental untuk memasuki Sekolah Dasar"
                                ]}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Daily Activities */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Kegiatan Harian</h2>
                    <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                        Aktivitas harian di TK ABA Mertosanan dirancang untuk menstimulasi berbagai aspek perkembangan anak
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <ActivityCard 
                            time="07:30 - 08:00"
                            title="Penyambutan & Ikrar"
                            description="Anak-anak disambut dengan senyuman dan ikrar pagi untuk memulai kegiatan"
                            icon="sun"
                        />
                        <ActivityCard 
                            time="08:00 - 08:30"
                            title="Kegiatan Religius"
                            description="Doa bersama, hafalan surat pendek, dan pengenalan nilai-nilai islami"
                            icon="book"
                        />
                        <ActivityCard 
                            time="08:30 - 09:15"
                            title="Kegiatan Inti I"
                            description="Pembelajaran tematik sesuai dengan kurikulum yang telah ditetapkan"
                            icon="brain"
                        />
                        <ActivityCard 
                            time="09:15 - 09:45"
                            title="Istirahat & Makan"
                            description="Waktu makan snack bersama dan istirahat dengan tetap dalam pengawasan"
                            icon="utensils"
                        />
                        <ActivityCard 
                            time="09:45 - 10:30"
                            title="Kegiatan Inti II"
                            description="Pembelajaran tematik lanjutan dengan pendekatan yang berbeda"
                            icon="activity"
                        />
                        <ActivityCard 
                            time="10:30 - 11:00"
                            title="Recap & Pulang"
                            description="Mengulang pembelajaran hari ini dan persiapan pulang"
                            icon="home"
                        />
                    </div>
                </div>
            </section>

            {/* Extracurricular */}
            <section className="py-16 bg-highlight/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Kegiatan Ekstrakurikuler</h2>
                    <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                        Kami menyediakan berbagai kegiatan ekstrakurikuler untuk mengembangkan minat dan bakat anak
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <ExtraActivity 
                            title="Menari Tradisional"
                            description="Pengenalan seni tari tradisional untuk menumbuhkan cinta budaya dan melatih koordinasi gerak"
                            icon="music"
                            schedule="Senin, 10:00 - 11:00"
                            imageUrl="https://images.pexels.com/photos/3662824/pexels-photo-3662824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        />
                        <ExtraActivity 
                            title="Melukis & Kerajinan"
                            description="Mengembangkan kreativitas dan motorik halus melalui kegiatan seni rupa dan kerajinan tangan"
                            icon="paintbrush"
                            schedule="Selasa, 10:00 - 11:00"
                            imageUrl="https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        />
                        <ExtraActivity 
                            title="Olahraga Mini"
                            description="Aktivitas fisik yang menyenangkan untuk mengembangkan kemampuan motorik kasar dan kerjasama tim"
                            icon="activity"
                            schedule="Rabu, 10:00 - 11:00"
                            imageUrl="https://images.pexels.com/photos/8535233/pexels-photo-8535233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        />
                        <ExtraActivity 
                            title="Little Chef"
                            description="Kegiatan memasak sederhana untuk mengenalkan anak pada makanan sehat dan proses pembuatannya"
                            icon="chef-hat"
                            schedule="Kamis, 10:00 - 11:00"
                            imageUrl="https://images.pexels.com/photos/4147035/pexels-photo-4147035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        />
                    </div>
                </div>
            </section>

            {/* Interactive Calendar */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Kalender Akademik</h2>
                    <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                        Lihat dan jelajahi kalender akademik secara interaktif untuk informasi kegiatan yang lebih detail
                    </p>
                    
                    <KalenderAkademik />
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Tertarik dengan Program Kami?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Daftarkan anak Anda sekarang di TK ABA Mertosanan untuk memberikan pendidikan terbaik sejak usia dini.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/pendaftaran">
                            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                Daftar Sekarang <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/kontak">
                            <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                                <Phone className="mr-2 h-5 w-5" /> Hubungi Kami
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}