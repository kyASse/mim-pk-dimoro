import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || "http://localhost:3000";

  // Static public routes; dynamic content like berita/[id] can be added later from DB
  const routes = [
    "",
    "/program",
    "/galeri",
    "/kalender-akademik",
    "/kontak",
    "/pendaftaran",
    "/tentang-kami",
  ];

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Dynamic entries: published berita
  try {
    const supabase = await createClient();
    const { data: berita } = await supabase
      .from('berita')
      .select('id, updated_at, tanggal_terbit, status')
      .eq('status', 'published')
      .order('tanggal_terbit', { ascending: false });

    const beritaEntries: MetadataRoute.Sitemap = (berita || []).map((b: any) => ({
      url: `${siteUrl}/berita/${b.id}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : (b.tanggal_terbit ? new Date(b.tanggal_terbit) : now),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticEntries, ...beritaEntries];
  } catch {
    // If any error (e.g., env missing), fall back to static only
    return staticEntries;
  }
}
