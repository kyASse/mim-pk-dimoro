"use client"
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Quote } from "lucide-react";
import { HEADMASTER_WELCOME } from "@/lib/school-data";

export default function AboutSection() {
    return (
        <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="md:w-5/12 relative flex justify-center">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full -z-10"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-background bg-card">
                                <Image
                                    src={HEADMASTER_WELCOME.photoUrl || "https://placehold.co/600x400/059669/ffffff.png?text=Kepala+Madrasah"}
                                    alt={HEADMASTER_WELCOME.name}
                                    width={400}
                                    height={500}
                                    className="w-full h-auto object-cover aspect-[4/5]"
                                />
                                <div className="p-4 bg-card text-card-foreground text-center">
                                    <h3 className="font-bold text-lg">{HEADMASTER_WELCOME.name}</h3>
                                    <p className="text-sm text-muted-foreground">{HEADMASTER_WELCOME.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-7/12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Quote className="h-4 w-4" />
                            Sambutan Kepala Madrasah
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Selamat Datang di MIM PK Dimoro
                        </h2>
                        <blockquote className="text-lg text-muted-foreground italic mb-6 border-l-4 border-primary pl-4 py-1">
                            &ldquo;{HEADMASTER_WELCOME.summary}&rdquo;
                        </blockquote>
                        <p className="text-sm text-muted-foreground mb-8">
                            {HEADMASTER_WELCOME.paragraphs[1]}
                        </p>
                        <div>
                            <Link 
                                href="/tentang-kami"
                                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-semibold transition-colors shadow-md hover:shadow-lg"
                            >
                                Baca Sambutan Selengkapnya
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

