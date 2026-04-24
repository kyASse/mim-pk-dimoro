"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { UserPlus, Phone } from "lucide-react"

export default function CTASection() {
    return (
        <section className="py-16 bg-primary/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl  md:text-4xl font-bold mb-6"> Mari bergabung bersama TK ABA Mertosanan </h2>
                <p className="text-lg mb-8 max-w-3xl mx-auto">
                    Berikan pendidikan terbaik untuk buah hati Anda di TK ABA Mertosanan.
                    Kami membuka pendaftaran untuk sekolah anak usia dini. Bergabunglah sekarang dan dapatkan pengalaman pendidikan berkualitas.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href={"/pendaftaran"}>
                        <Button className="rounded-full bg-primary hover:bg-primary/80 text-primary-foreground">
                            <UserPlus className="w-5 h-5 mr-2"/> Daftar Sekarang
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
    )
}