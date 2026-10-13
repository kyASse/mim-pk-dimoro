import type { Metadata } from "next";
import { SCHOOL_NAME } from "@/lib/school-config";
import { getIKWMContent } from "@/lib/services/public-content";
import IKWMContentClient from "./IKWMContentClient";

export const metadata: Metadata = {
  title: `Ikatan Wali Murid (IKWM) - ${SCHOOL_NAME}`,
  description: `Profil, kepengurusan, program kerja, dan sinergi madrasah dengan Ikatan Wali Murid (IKWM) ${SCHOOL_NAME}. Membangun karakter mulia bersama madrasah.`,
  openGraph: {
    title: `Ikatan Wali Murid (IKWM) - ${SCHOOL_NAME}`,
    description: `Profil, kepengurusan, program kerja, dan sinergi madrasah dengan Ikatan Wali Murid (IKWM) ${SCHOOL_NAME}. Membangun karakter mulia bersama madrasah.`,
    url: "/ikatan-wali-murid",
    siteName: SCHOOL_NAME,
    locale: "id_ID",
    type: "website",
  },
};

/**
 * Public Page Route: /ikatan-wali-murid
 * Server Component yang melakukan data fetching konten IKWM terkini
 * dan menyerahkannya ke IKWMContentClient untuk rendering interaktif.
 */
export default async function AboutIKWMPage() {
  const content = await getIKWMContent();

  return <IKWMContentClient content={content} />;
}
