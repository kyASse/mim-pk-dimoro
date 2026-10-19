import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicOpinionBySlug } from "@/lib/services/ruang-perspektif";
import OpiniArticleReader from "@/components/ruang-perspektif/OpiniArticleReader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opinion = await getPublicOpinionBySlug(slug);
  if (!opinion) return { title: "Naskah Tidak Ditemukan | MIM PK Dimoro" };

  return {
    title: `${opinion.judul} | Ruang Perspektif MIM PK Dimoro`,
    description: opinion.ringkasan,
    openGraph: {
      title: opinion.judul,
      description: opinion.ringkasan,
      images: opinion.gambar_sampul_url ? [opinion.gambar_sampul_url] : [],
    },
  };
}

export default async function OpiniDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opinion = await getPublicOpinionBySlug(slug);

  if (!opinion) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <OpiniArticleReader item={opinion} />
    </main>
  );
}
