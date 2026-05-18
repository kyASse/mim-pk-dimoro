"use client"

import { motion } from "motion/react"
import {
    Building2,
    Calendar,
    Award,
    School2,
    MapPin,
    Hash
} from "lucide-react"

import { SCHOOL_NAME } from "@/lib/school-config"

const identityData = [
    { label: "NPSN", value: "60711720" },
    { label: "NSM", value: "111233110050" },
    { label: "Tanggal Berdiri", value: "1 September 1967" },
    { label: "Status Sekolah", value: "Swasta" },
    { label: "Akreditasi", value: "A" },
    { label: "Bentuk Pendidikan", value: "Madrasah Ibtidaiyah" },
    { label: "Alamat", value: "Sudimoro, RT.003/RW.X" },
    { label: "Desa/Kelurahan", value: "Parangjoro" },
    { label: "Kecamatan", value: "Grogol" },
    { label: "Kabupaten", value: "Sukoharjo" },
    { label: "Provinsi", value: "Jawa Tengah" },
]

export default function SchoolIdentity() {
    return (
        <section className="py-16 bg-accent/10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-6">Identitas {SCHOOL_NAME}</h2>
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
                                    {item.label === "NPSN" && <Hash className="w-5 h-5 text-primary-foreground"/>}
                                    {item.label === "NSM" && <Hash className="w-5 h-5 text-primary-foreground"/>}
                                    {item.label === "Tanggal Berdiri" && <Calendar className="w-5 h-5 text-primary-foreground"/>}
                                    {item.label === "Status Sekolah" && <School2 className="w-5 h-5 text-primary-foreground"/>}
                                    {item.label === "Akreditasi" && <Award className="w-5 h-5 text-primary-foreground"/>}
                                    {item.label === "Bentuk Pendidikan" && <Building2 className="w-5 h-5 text-primary-foreground"/>}
                                    {["Alamat", "Desa/Kelurahan", "Kecamatan", "Kabupaten", "Provinsi"].includes(item.label) && <MapPin className="w-5 h-5 text-primary-foreground"/>}
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
