"use client"

import {
    Sun,
    BookOpen,
    Brain,
    Activity,
    Home,
    Utensils,
    Book,
    Users
} from "lucide-react"
import { motion } from "framer-motion"

interface ActivityCardProps {
    time: string
    title: string
    description: string
    icon: string
}

export default function ActivityCard({ time, title, description, icon }: ActivityCardProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'sun':
                return <Sun className="h-6 w-6" />;
            case 'book':
                return <Book className="h-6 w-6" />;
            case 'brain':
                return <Brain className="h-6 w-6" />;
            case 'activity':
                return <Activity className="h-6 w-6" />;
            case 'home':
                return <Home className="h-6 w-6" />;
            case 'utensils':
                return <Utensils className="h-6 w-6" />;
            case 'users':
                return <Users className="h-6 w-6" />;
            default:
                return <BookOpen className="h-6 w-6" />;
        }
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-white rounded-xl p-5 shadow-md border border-muted"
        >
            <div className="bg-primary/10 text-primary-foreground font-semibold px-3 py-1.5 rounded-full text-sm mb-4 inline-block">
                {time}
            </div>
            <div className="flex items-center mb-3">
                <div className="bg-accent/20 p-2 rounded-full mr-3">
                    {getIcon(icon)}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    )
}