"use client";

import { MessageCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OpiniStickyBottomDock({
  status,
  whatsappUrl,
  onPublish,
  onReject,
  loading,
}: {
  status: string;
  whatsappUrl: string;
  onPublish: () => void;
  onReject: () => void;
  loading?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur border-t border-border z-50 lg:hidden flex items-center justify-between gap-2 shadow-lg">
      <Button asChild variant="outline" size="sm" className="h-10 text-xs gap-1.5 flex-1">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4 text-emerald-600" /> WhatsApp
        </a>
      </Button>

      <Button
        variant="destructive"
        size="sm"
        disabled={loading}
        onClick={onReject}
        className="h-10 text-xs gap-1 flex-1"
      >
        <X className="size-4" /> Tolak
      </Button>

      <Button
        variant="default"
        size="sm"
        disabled={loading}
        onClick={onPublish}
        className="h-10 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
      >
        <Check className="size-4" /> {status === "terbit" ? "Perbarui" : "Terbitkan"}
      </Button>
    </div>
  );
}
