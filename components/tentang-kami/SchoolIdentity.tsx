"use client"

import { motion } from "motion/react"
import {
    Building2,
    Calendar,
    Award,
    School2,
    MapPin
} from "lucide-react"

const identityData = [
    { label: "NPSN", value: "20123456" },
    { label: "Tanggal Berdiri", value: "15 Juli 1985" },
    { label: "Status Sekolah", value: "Swasta" },
    { label: "Akreditasi", value: "A" },
    { label: "Bentuk Pendidikan", value: "TK/PAUD" },
    { label: "Alamat", value: "Jl. Mertosanan Wetan" },
    { label: "Desa/Kelurahan", value: "Potorono" },
    { label: "Kecamatan", value: "Banguntapan" },
    { label: "Kabupaten", value: "Bantul" },
    { label: "Provinsi", value: "D.I. Yogyakarta" },
]

export default function SchoolIdentity() {
    return (
        <section className="py-16 bg-accent/10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-6">Identitas Sekolah</h2>
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {identityData.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start space-x-3"
                            >
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {index === 0 && <Building2 className="w-5 h-5 text-primary-foreground"/>}
                                    {index === 1 && <Calendar className="w-5 h-5 text-primary-foreground"/>}
                                    {index === 2 && <School2 className="w-5 h-5 text-primary-foreground"/>}
                                    {index === 3 && <Award className="w-5 h-5 text-primary-foreground"/>}
                                    {index === 4 && <School2 className="w-5 h-5 text-primary-foreground"/>}
                                    {index > 4 && <MapPin className="w-5 h-5 text-primary-foreground"/>}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="font-semibold">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}