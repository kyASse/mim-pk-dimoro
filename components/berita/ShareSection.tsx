"use client"

import { Button } from "@/components/ui/button";
import { ShareIcon, Facebook, Twitter, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ShareSectionProps {
    title: string;
}

export default function ShareSection({ title }: ShareSectionProps) {
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    const shareText = `Baca berita: ${title}`;

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center">
                    <ShareIcon className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold text-gray-800">Bagikan Artikel:</span>
                </div>
                <div className="flex gap-3">
                    {/* Facebook Share */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        onClick={() => {
                            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
                            window.open(url, '_blank');
                        }}
                    >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                    </Button>

                    {/* Twitter Share */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 transition-colors"
                        onClick={() => {
                            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
                            window.open(url, '_blank');
                        }}
                    >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                    </Button>

                    {/* WhatsApp Share */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-colors"
                        onClick={() => {
                            const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
                            window.open(url, '_blank');
                        }}
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    );
}
