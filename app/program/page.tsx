import { Metadata } from "next";
import { getProgramContent, getExtracurriculars } from "@/lib/services/public-content";
import ProgramContent from "@/components/program/ProgramContent";
import { SCHOOL_NAME } from "@/lib/school-config";

export const metadata: Metadata = {
  title: `Program & Kurikulum Terpadu | ${SCHOOL_NAME}`,
  description: `Mengenal kurikulum terpadu Merdeka & ISMUBA, program unggulan Tahfidz Al-Qur'an, Klinik Belajar, dan ragam ekstrakurikuler di ${SCHOOL_NAME}.`,
};

export const dynamic = "force-dynamic";

export default async function ProgramPage() {
  const [program, extracurriculars] = await Promise.all([
    getProgramContent(),
    getExtracurriculars(),
  ]);

  return <ProgramContent program={program} extracurriculars={extracurriculars} />;
}
