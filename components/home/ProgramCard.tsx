"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProgramCardProps {
    title: string;
    description: string;
    image: string;
    href: string;
}

export default function ProgramCard({ title, description, image, href}: ProgramCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-muted h-full flex flex-col"
        >
            <div className="relative h-48 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className=" p-5 flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className=" text-muted-foreground mb-4 flex-grow">{description}</p>
                <Button className="w-full" variant="outline">
                <Link
                    href={href}
                    className="inline-flex items-center text-accent-foreground font-medium hover:underline mt-auto"
                >
                    Pelajari lebih lanjut
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
                </Button>
            </div>
        </motion.div>
    )
}