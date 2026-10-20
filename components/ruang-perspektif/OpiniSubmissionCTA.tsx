import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OpiniSubmissionCTA() {
  return (
    <section className="my-12 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border/50 bg-muted/20 p-6 sm:p-10 text-center">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
          <PenSquare className="size-6" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Punya Pengalaman atau Ide Edukatif?
        </h3>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Kirimkan tulisan opini Anda (300–800 kata). Setiap gagasan dari bapak/ibu guru dan wali murid sangat berharga bagi kemajuan madrasah kita.
        </p>
        <Button asChild className="rounded-full px-6 h-10 text-sm">
          <Link href="/ruang-perspektif/kirim">Kirim Gagasan Sekarang</Link>
        </Button>
      </div>
    </section>
  );
}
