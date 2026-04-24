import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    background?: string;
}

export default function PageHeader({ title, description, background = "bg-primary/20" }: 
    PageHeaderProps) {
        return (
            <section className={cn("py-12 md:py-16 mb-12", background)}>
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                            <Link href="/" className="flex items-center hover:text-foreground">
                                <Home className="h-4 w-4 mr-1" /> Beranda
                            </Link>
                            <ChevronRight className=" h-4 w-4 mx-2" />
                            <span className="font-medium text-foreground">{title}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
                        {description && (
                            <p className="text-lg text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>
            </section>
        )
    }