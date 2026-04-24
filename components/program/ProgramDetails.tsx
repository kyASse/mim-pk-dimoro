"use client"

import Image from "next/image"
import { Clock, Check } from "lucide-react"
import { motion } from "framer-motion"

interface ScheduleItem {
    day: string
    hours: string
}

interface ProgramDetailsProps {
    title: string
    description: string
    imageUrl: string
    schedule: ScheduleItem[]
    features: string[]
}

export default function ProgramDetails({
    title,
    description,
    imageUrl,
    schedule,
    features
}: ProgramDetailsProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground mb-6">{description}</p>

                    <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-2 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-primary" /> Jadwal
                        </h4>
                        <ul className="space-y-2">
                            {schedule.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <div className="bg-primary/10 px-3 py-1 rounded-full text-sm mr-3 min-w-[120px] text-center">
                                        {item.day}
                                    </div>
                                    <span>{item.hours}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-2">Kegiatan Pembelajaran</h4>
                        <ul className="space-y-2">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start"
                                >
                                    <Check className="w-5 h-5 text-accent mr-2 mt-0.5" />
                                    <span className="text-sm">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}