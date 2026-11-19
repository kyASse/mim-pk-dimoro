import type { Metadata } from "next";
import { SCHOOL_NAME } from "@/lib/school-config";
import { getStrukturOrganisasiContent } from "@/lib/services/public-content";
import StrukturOrganisasiClient from "@/components/struktur-organisasi/StrukturOrganisasiClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Struktur Organisasi - ${SCHOOL_NAME}`,
  description: `Susunan pimpinan madrasah, wali kelas, dewan guru, dan tenaga kependidikan ${SCHOOL_NAME}.`,
  openGraph: {
    title: `Struktur Organisasi - ${SCHOOL_NAME}`,
    description: `Susunan pimpinan madrasah, wali kelas, dewan guru, dan tenaga kependidikan ${SCHOOL_NAME}.`,
    url: "/struktur-organisasi",
    siteName: SCHOOL_NAME,
    locale: "id_ID",
    type: "website",
  },
};

/**
 * Public Page Route: /struktur-organisasi
 * Server Component yang mengambil data struktur organisasi terkini dari Supabase
 * dengan graceful fallback ke data default dan menyerahkannya ke StrukturOrganisasiClient.
 */
export default async function StrukturOrganisasiPage() {
  const content = await getStrukturOrganisasiContent();

  return <StrukturOrganisasiClient content={content} />;
}
