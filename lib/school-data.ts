/**
 * Centralized School Data Layer for MIM PK Dimoro
 * Single Source of Truth derived from official school PDFs / documents.
 */

export interface HeadmasterWelcome {
  name: string;
  title: string;
  photoUrl: string;
  summary: string;
  paragraphs: string[];
}

export interface VisionMission {
  vision: string;
  visionIndicators: string[];
  missions: string[];
  motto: string;
}

export interface TahfidzProgram {
  title: string;
  target: string;
  methods: string[];
  evaluation: string;
}

export interface KlinikBelajar {
  title: string;
  description: string;
  features: string[];
}

export interface ExcellentPrograms {
  tahfidz: TahfidzProgram;
  klinikBelajar: KlinikBelajar;
  characterBuilding: string[];
  extracurriculars: string[];
  graduateProfiles: string[];
}

export interface IntegratedCurriculum {
  title: string;
  description: string;
  pillars: string[];
  components: {
    national: string[];
    muhammadiyah: string[];
    distinctive: string[];
  };
}

export interface CompetentEducators {
  title: string;
  description: string;
  programs: string[];
  commitments: string[];
}

export const HEADMASTER_WELCOME: HeadmasterWelcome = {
  name: 'Hj. Anik Sulityowati, S.Ag.',
  title: 'Kepala MI Muhammadiyah Dimoro',
  photoUrl: '/images/headmaster.jpg',
  summary:
    'MIM PK Dimoro berkomitmen menyelenggarakan pendidikan Islam terpadu yang memadukan kurikulum nasional, ke-Muhammadiyahan, dan program unggulan sains serta keagamaan untuk membina generasi yang beriman, cerdas, dan berakhlakul karimah.',
  paragraphs: [
    'Assalamu’alaikum Warahmatullahi Wabarakatuh.',
    'Puji syukur kehadirat Allah SWT yang telah memberikan rahmat dan hidayah-Nya sehingga MI Muhammadiyah Dimoro (MIM PK Dimoro) terus berkembang menjadi lembaga pendidikan dasar Islam yang unggul, berkemajuan, dan berkarakter.',
    'Sebagai madrasah ibtidaiyah berbasiskam Program Khusus (PK), kami berkomitmen untuk menyelenggarakan pendidikan terpadu yang memadukan kurikulum nasional, ke-Muhammadiyahan, dan program unggulan sains serta keagamaan.',
    'Kami percaya bahwa setiap anak memiliki potensi unik yang dapat dikembangkan secara optimal melalui bimbingan pendidik yang kompeten, berdedikasi, serta berakhlakul karimah. Melalui program Tahfidz Al-Qur’an, Klinik Belajar, dan berbagai kegiatan ekstrakurikuler, kami membina generasi yang beriman, cerdas, dan siap menghadapi tantangan zaman.',
    'Terima kasih atas kepercayaan para orang tua/wali murid dan dukungan seluruh masyarakat. Mari bersama-sama mewujudkan generasi Islami yang unggul dan berilmu.',
    'Wassalamu’alaikum Warahmatullahi Wabarakatuh.',
  ],
};

export const VISION_MISSION: VisionMission = {
  vision:
    'Terwujudnya generasi Islami yang unggul dalam prestasi, berakhlak mulia, cerdas, berkarakter, dan berwawasan lingkungan.',
  visionIndicators: [
    'Terwujudnya lulusan yang memiliki pemahaman dan pengamalan ajaran Islam secara kaffah.',
    'Terwujudnya prestasi akademik dan non-akademik di tingkat lokal, nasional, maupun internasional.',
    'Terwujudnya pembiasaan akhlakul karimah dalam kehidupan sehari-hari.',
    'Terwujudnya kemampuan tahfidz Al-Qur’an sesuai target capaian madrasah.',
    'Terwujudnya keterampilan berpikir kritis, kreatif, dan berwawasan teknologi informasi.',
    'Terwujudnya kesadaran serta kepedulian terhadap kelestarian dan kebersihan lingkungan.',
    'Terwujudnya tata kelola madrasah yang akuntabel, profesional, dan berbasis kemitraan.',
  ],
  missions: [
    'Menyelenggarakan pendidikan Islam terpadu berlandaskan Al-Qur’an dan As-Sunnah.',
    'Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM).',
    'Meningkatkan pembinaan Tahfidz Al-Qur’an dan kajian keislaman secara berkesinambungan.',
    'Mengembangkan bakat, minat, dan potensi siswa melalui kegiatan ekstrakurikuler dan kompetisi.',
    'Membudayakan sikap disiplin, sopan santun, dan kepedulian sosial di lingkungan madrasah.',
    'Meningkatkan kompetensi dan profesionalisme pendidik serta tenaga kependidikan.',
    'Mewujudkan lingkungan sekolah yang bersih, hijau, sehat, dan ramah anak.',
    'Jalin kerjasama yang harmonis dengan orang tua, alumni, dan masyarakat luas.',
  ],
  motto: 'Unggul dalam Prestasi, Anggun dalam Moral, Berkarakter Islami.',
};

export const EXCELLENT_PROGRAMS: ExcellentPrograms = {
  tahfidz: {
    title: "Program Tahfidz Al-Qur'an",
    target: 'Minimal hafal 1 juz (Juz 30) saat lulus, dengan target pengayaan hingga 3 juz.',
    methods: [
      'Setoran harian sebelum KBM',
      'Muroja’ah bersama setiap pagi',
      'Bimbingan khusus tartil & tajwid',
      'Ujian munaqosah berkala',
    ],
    evaluation: 'Munaqosah harian dan sertifikasi kelulusan tahfidz akhir tahun.',
  },
  klinikBelajar: {
    title: 'Klinik Belajar',
    description:
      'Layanan bimbingan belajar intensif dan pendampingan personal bagi siswa untuk mengatasi kesulitan belajar maupun pengembangan potensi berbakat.',
    features: [
      'Diagnostik kesulitan belajar siswa',
      'Pendampingan remedial dan pengayaan khusus',
      'Konsultasi privat bersama guru pembimbing',
      'Pembimbingan persiapan kompetisi (KSN/KSM)',
    ],
  },
  characterBuilding: [
    'Pembiasaan Shalat Dhuha dan Shalat Fardhu Berjamaah',
    'Kajian Karakter Islami dan Kultum Siswa',
    'Program Infaq Harian & Kepedulian Sosial',
    'Pramuka Hizbul Wathan (HW) & Tapak Suci',
  ],
  extracurriculars: [
    'Tapak Suci Putera Muhammadiyah',
    'Hizbul Wathan (HW)',
    'Seni Seni Kaligrafi & Tilawah',
    'Robotika & Science Club',
    'Olah Raga (Futsal, Bulutangkis, Panahan)',
    'English & Arabic Club',
  ],
  graduateProfiles: [
    'Memiliki aqidah yang lurus dan pemahaman keislaman yang kuat.',
    'Hafal Al-Qur’an minimal 1 juz dengan bacaan yang benar.',
    'Menguasai kompetensi dasar akademik tingkat sekolah dasar/madrasah.',
    'Memiliki kepribadian jujur, disiplin, berakhlak mulia, dan mandiri.',
    'Memiliki keterampilan berpikir kritis, berbudaya, dan mampu berkomunikasi dengan baik.',
    'Peduli terhadap lingkungan dan memiliki jiwa kepemimpinan serta kesetiakawanan.',
  ],
};

export const INTEGRATED_CURRICULUM: IntegratedCurriculum = {
  title: 'Kurikulum Terpadu MIM PK Dimoro',
  description:
    'Sistem kurikulum yang mengintegrasikan Standar Nasional Pendidikan (SNP), Kurikulum Ke-Muhammadiyahan, serta Program Keunggulan Madrasah.',
  pillars: [
    'Integrasi Nilai-Nilai Al-Qur’an dan As-Sunnah dalam Setiap Mata Pelajaran',
    'Penguatan Pendidikan Karakter (PPK) & Profil Pelajar Pancasila Rahmatan Lil Alamin',
    'Pengembangan Literasi Numerasi dan Sains Digital',
    'Pembelajaran Berbasis Project (Project-Based Learning)',
    'Kurikulum Ke-Muhammadiyahan dan Bahasa Arab (Kemuhammadiyahan & Bahasa)',
    'Program Khusus Tahfidz & Tartil Al-Qur’an',
    'Pembinaan Prestasi Akademik & Non-Akademik (Klinik Belajar)',
    'Pendidikan Berbasis Lingkungan Hidup dan Budaya Lokal',
  ],
  components: {
    national: [
      'Pendidikan Pancasila & Kewarganegaraan',
      'Bahasa Indonesia',
      'Matematika',
      'Ilmu Pengetahuan Alam & Sosial (IPAS)',
      'Seni & Budaya',
      'Pendidikan Jasmani, Olahraga & Kesehatan',
    ],
    muhammadiyah: ['Al-Islam', 'Kemuhammadiyahan', 'Bahasa Arab'],
    distinctive: [
      'Tahfidz Al-Qur’an',
      'Klinik Belajar',
      'Bahasa Inggris Dasar',
      'Informatika & Computations',
    ],
  },
};

export const COMPETENT_EDUCATORS: CompetentEducators = {
  title: 'Pendidik & Tenaga Kependidikan Kompeten',
  description:
    'Tim pendidik dan tenaga kependidikan berpendidikan S1/S2 yang profesional, berdedikasi tinggi, dan terus mengembangkan potensi melalui pelatihan berkelanjutan.',
  programs: [
    'Workshop & Pelatihan Pembelajaran Inovatif (PAIKEM)',
    'Bimbingan Sertifikasi Guru & Profesi Pendidik',
    'Pelatihan Pengembangan Kurikulum & Asesmen Pembelajaran',
    'Pembinaan Tahsin dan Tahfidz Pendidik',
    'Studi Banding & Kolaborasi antar Sekolah Muhammadiyah',
    'Pelatihan Teknologi Informasi dan Media Pembelajaran Digital',
    'Peningkatan Kompetensi Pedagogik & Profesional Guru',
    'Evaluasi Kinerja Pendidik dan Pendampingan Peer-Mentoring',
  ],
  commitments: [
    'Mendidik dengan teladan akhlakul karimah dan kasih sayang.',
    'Memberikan layanan pembelajaran yang adil, ramah anak, dan inklusif.',
    'Terus meningkatkan kualifikasi dan keterampilan sesuai perkembangan zaman.',
    'Membangun komunikasi aktif dan transparan dengan orang tua siswa.',
    'Menjaga integritas, profesionalisme, dan nama baik madrasah.',
  ],
};
