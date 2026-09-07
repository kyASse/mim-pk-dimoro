import {
  getHeadmasterContent,
  getVisionMissionContent,
  getSchoolIdentityContent,
} from "@/lib/services/public-content";
import TentangKamiContent from "@/components/tentang-kami/TentangKamiContent";
import { SCHOOL_NAME } from "@/lib/school-config";

export const metadata = {
  title: `Tentang Kami - ${SCHOOL_NAME}`,
  description: `Mengenal profil, visi-misi, sejarah, legalitas, dan komitmen pendidikan ${SCHOOL_NAME}.`,
};

export default async function AboutUsPage() {
  const [headmaster, visionMission, identity] = await Promise.all([
    getHeadmasterContent(),
    getVisionMissionContent(),
    getSchoolIdentityContent(),
  ]);

  return (
    <TentangKamiContent
      headmaster={headmaster}
      visionMission={visionMission}
      identity={identity}
    />
  );
}
