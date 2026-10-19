import { Metadata } from "next";
import OpiniSubmissionForm from "@/components/ruang-perspektif/OpiniSubmissionForm";

export const metadata: Metadata = {
  title: "Kirim Tulisan Opini | Ruang Perspektif MIM PK Dimoro",
  description: "Formulir kontribusi naskah opini untuk guru, orang tua murid, dan pemerhati pendidikan MIM PK Dimoro.",
};

export default function KirimOpiniPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 bg-muted/20">
      <OpiniSubmissionForm />
    </main>
  );
}
