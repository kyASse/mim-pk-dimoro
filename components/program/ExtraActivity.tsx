"use client"

import Image from "next/image"
import {
    Music,
    Paintbrush,
    Activity,
    ChefHat,
    Shapes,
    Leaf
} from "lucide-react"
import { motion } from "framer-motion"

interface ExtraActivityProps {
    title: string
    description: string
    icon: string
    schedule: string
    imageUrl: string
}

export default function ExtraActivity({
    title,
    description,
    icon,
    schedule,
    imageUrl
}: ExtraActivityProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'music':
                return <Music className="h-6 w-6" />;
            case 'paintbrush':
                return <Paintbrush className="h-6 w-6" />;
            case 'activity':
                return <Activity className="h-6 w-6" />;
            case 'chef-hat':
                return <ChefHat className="h-6 w-6" />;
            case 'shapes':
                return <Shapes className="h-6 w-6" />;
            case 'leaf':
                return <Leaf className="h-6 w-6" />;
            default:
                return <Activity className="h-6 w-6" />;
        }
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
        >
            <div className="relative h-48 md:h-auto md:w-1/3">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-5 md:w-2/3">
                <div className="flex items-center mb-3">
                    <div className="bg-highlight/20 p-2 rounded-full mr-3">
                        {getIcon(icon)}
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{description}</p>
                <div className="bg-accent/10 px-3 py-1.5 rounded-full text-sm inline-flex items-center">
                    <span className="font-medium">Jadwal:</span>
                    <span className="ml-1">{schedule}</span>
                </div>
            </div>
        </motion.div>
    )
}