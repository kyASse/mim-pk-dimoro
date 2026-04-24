"use client"
import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Users, ChevronRight } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Selamat Datang di TK ABA Mertosanan</h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            TK ABA Mertosanan adalah lembaga pendidikan anak usia dini yang
                            berkomitmen untuk memberikan pendidikan berkualitas 
                            dengan nilai-nilai islami. Kami percaya bahwa setiap anak
                            memiliki potensi unik yang perlu dikembangkan sejak dini.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="mt-1 bg-accent/20 p-2 rounded-full">
                                    <Award className=" h-5 w-6 text-accent-foreground"/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-lg">Pendidikan Berkualitas</h3>
                                    <p className="text-muted-foreground">Kurikulum terintegrasi dengan nilai islami</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className=" mt-1 bg-primary/20 p-2 rounded-full">
                                    <Heart className="h-5 w-6 text-primary-foreground"/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-lg">Lingkungan Ramah Anak</h3>
                                    <p className="text-muted-foreground">Suasana belajar yang menyenangkan dan aman</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className=" mt-1 bg-highlight/20 p-2 rounded-full">
                                    <Users className="h-5 w-6 text-primary-foreground"/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-lg">Tenaga Pendidik Profesional</h3>
                                    <p className="text-muted-foreground">Guru berpengalaman dan berkompeten</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button className=" rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 font-semibold transition-colors">
                                <Link href="/tentang-kami" className="flex items-center gap-2">
                                    Pelajari Lebih Lanjut
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative mt-8 md:mt-0">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary rounded-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary rounded-full -z-10"></div>
                            <Image
                            src="https://tk-aba-mertosanan.sch.id/wp-content/uploads/2024/06/3.jpg"
                            alt="Kegiatan TK ABA Mertosanan"
                            width={600}
                            height={400}
                            className="rounded-2xl shadow-lg "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}