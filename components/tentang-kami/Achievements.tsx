"use client"

import { motion } from "motion/react";
import { Award, Trophy, Medal, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Prestasi = {
    nama_prestasi: string;
    tingkat: string;
    tahun: number;
    deskripsi: string;
    // Add other fields if needed, matching your Supabase 'prestasi' table
};

export default function Achievements() {
    const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
    useEffect(() => {
        const supabase = createClient();
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('prestasi')
                .select('*');

            if (error) {
                console.error('Error fetching prestasi data:', error);
                return;
            }

            setPrestasi(data);
        }

        fetchData();
    }, []);

    // Group prestasi by 'tahun' instead of 'tingkat'
    const groupedPrestasi = prestasi.reduce<Record<number, Prestasi[]>>((acc, curr) => {
        if (!acc[curr.tahun]) {
            acc[curr.tahun] = [];
        }
        acc[curr.tahun].push(curr);
        return acc;
    }, {});

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Prestasi Kami</h2>

                <div className="max-w-4xl mx-auto">
                    {Object.entries(groupedPrestasi).map(([tahun, prestasiList]) => (
                        <div key={tahun} className="mb-12 last:mb-0">
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <Trophy className="w-6 h-6 mr-2 text-primary" />
                                Tahun {tahun}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {prestasiList.map((prestasi, index) => (
                                    <motion.div
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, y: 50 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        viewport={{ once: true }}
                                        className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-muted"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            {index === 0 && <Award className="w-5 h-5 text-primary-foreground" />}
                                            {index === 1 && <Trophy className="w-5 h-5 text-primary-foreground" />}
                                            {index === 2 && <Medal className="w-5 h-5 text-primary-foreground" />}
                                            {index === 3 && <Star className="w-5 h-5 text-primary-foreground" />}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-1">{prestasi.nama_prestasi}</h4>
                                            <p className="text-sm text-muted-foreground font-semibold">Tingkat {prestasi.tingkat}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}