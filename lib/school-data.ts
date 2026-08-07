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
  objective: string;
  methods: string[];
  activities: string[];
  graduateTargets: string[];
  evaluation: string;
}

export interface KlinikBelajar {
  title: string;
  description: string;
  objective: string;
  features: string[];
  targetAudience: string[];
  activities: string[];
  learningApproaches: string[];
  expectationStatement: string;
}

export interface ExcellentPrograms {
  tahfidz: TahfidzProgram;
  klinikBelajar: KlinikBelajar;
  characterBuilding: string[];
  extracurriculars: string[];
  graduateProfiles: string[];
}

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface IntegratedCurriculum {
  title: string;
  description: string;
  pillars: string[];
  pillarDetails: PillarItem[];
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
    objective:
      'Membimbing dan membina siswa agar mampu membaca, menghafal, dan mengamalkan Al-Qur’an secara tartil, lancar, serta konsisten dengan tajwid yang benar sebagai landasan karakter Islami.',
    methods: [
      'Setoran harian sebelum KBM',
      'Muroja’ah bersama setiap pagi',
      'Bimbingan khusus tartil & tajwid',
      'Ujian munaqosah berkala',
    ],
    activities: [
      'Setoran Harian Tahfidz (sebelum KBM jam 07.00 - 07.30)',
      'Muroja’ah Bersama Setiap Pagi',
      'Bimbingan Khusus Tartil & Tajwid',
      'Klasikal Baca Tulis Al-Qur’an (BTQ)',
      'Kajian & Pemahaman Makna Ayat Pendek',
      'Ujian Munaqosah Berkala Akhir Semester',
      'Wisuda & Sertifikasi Tahfidz Akhir Tahun',
    ],
    graduateTargets: [
      'Minimal hafal 1 juz (Juz 30) saat lulus madrasah dengan bacaan yang fasih dan tartil.',
      'Target pengayaan hafalan hingga 3 juz bagi siswa berpotensi.',
      'Mampu membaca Al-Qur’an sesuai kaidah ilmu tajwid dan makhrajul huruf yang benar.',
      'Memiliki kebiasaan muroja’ah mandiri dan kecintaan membaca Al-Qur’an dalam kehidupan sehari-hari.',
    ],
    evaluation: 'Munaqosah harian dan sertifikasi kelulusan tahfidz akhir tahun.',
  },
  klinikBelajar: {
    title: 'Klinik Belajar',
    description:
      'Layanan bimbingan belajar intensif dan pendampingan personal bagi siswa untuk mengatasi kesulitan belajar maupun pengembangan potensi berbakat.',
    objective:
      'Layanan bimbingan belajar intensif dan pendampingan personal yang dirancang untuk membantu siswa mengatasi kesulitan belajar, memperkuat pemahaman akademik, serta mengembangkan potensi bakat siswa secara optimal.',
    features: [
      'Diagnostik kesulitan belajar siswa',
      'Pendampingan remedial dan pengayaan khusus',
      'Konsultasi privat bersama guru pembimbing',
      'Pembimbingan persiapan kompetisi (KSN/KSM)',
    ],
    targetAudience: [
      'Siswa yang membutuhkan remedi atau pendampingan ekstra pada mata pelajaran tertentu.',
      'Siswa yang bersiap menghadapi asesmen, ujian sekolah, atau kompetisi sains (KSM/KSN).',
      'Siswa berbakat yang memerlukan pengayaan materi akademik advanced.',
    ],
    activities: [
      'Diagnostik Kesulitan Belajar dan pemetaan akademik awal.',
      'Bimbingan Remedial Terarah untuk materi yang belum dikuasai.',
      'Pengayaan Khusus (Enrichment) bagi siswa berbakat.',
      'Konsultasi Privat Belajar dengan guru pembimbing.',
      'Pembimbingan Intensif Kompetisi (KSM / KSN / Math & Science Olympiad).',
      'Kelompok Belajar Sebaya (Peer Learning Groups).',
      'Try Out & Latihan Soal Interaktif secara berkala.',
      'Evaluasi Progress Belajar Bulanan & Laporan Perkembangan kepada Orang Tua.',
    ],
    learningApproaches: [
      'Personalized Learning (Pembelajaran Disesuaikan Kebutuhan Individu)',
      'Diagnostic-Based Remediation (Remidiasi Berbasis Diagnostik)',
      'Interactive & Fun Learning (Pembelajaran Interaktif & Menyenangkan)',
      'Small Group Mentoring (Bimbingan Kelompok Kecil)',
      'Continuous Assessment & Feedback (Evaluasi & Umpan Balik Berkelanjutan)',
    ],
    expectationStatement:
      'Dengan adanya Klinik Belajar, setiap siswa MIM PK Dimoro diharapkan dapat tumbuh percaya diri, mencapai prestasi akademik yang optimal, serta tidak ada siswa yang tertinggal dalam proses pembelajaran.',
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
    'Akademik',
    'Al-Islam',
    'Kemuhammadiyahan',
    'Karakter Islami',
    'Kepemimpinan',
    'Life Skill',
    'Ekstrakurikuler',
    'Pembiasaan Harian',
  ],
  pillarDetails: [
    {
      id: 'akademik',
      title: 'Akademik',
      description:
        'Pengembangan kemampuan akademik siswa melalui Kurikulum Merdeka yang disesuaikan dengan perkembangan dan kebutuhan siswa.',
      items: [
        'Pendidikan Pancasila & Kewarganegaraan',
        'Bahasa Indonesia & Literasi Dasar',
        'Matematika & Ilmu Pengetahuan Alam dan Sosial (IPAS)',
        'Bahasa Inggris Dasar & Informatika / Koding',
        'Pengembangan Literasi Numerasi & Sains Digital',
        'Pembelajaran Berbasis Project (Project-Based Learning)',
      ],
    },
    {
      id: 'al-islam',
      title: 'Al-Islam',
      description:
        'Penanaman nilai-nilai Al-Qur’an dan As-Sunnah serta pemahaman agama Islam secara kaffah sejak dini.',
      items: [
        'Pendidikan Al-Qur’an Hadis & Akidah Akhlak',
        'Fikih Ibadah & Sejarah Kebudayaan Islam (SKI)',
        'Tahfidz & Tartil Al-Qur’an (Target Hafalan Minimal 1 Juz)',
        'Bimbingan Baca Tulis Al-Qur’an (BTQ) & Tajwid',
        'Kajian Keislaman & Munaqosah Berkala',
      ],
    },
    {
      id: 'kemuhammadiyahan',
      title: 'Kemuhammadiyahan',
      description:
        'Pembentukan kader Muhammadiyah yang memiliki pemahaman ideologi, sejarah, dan nilai-nilai persyarikatan.',
      items: [
        'Pelajaran Kemuhammadiyahan & Ke-Aisyiyahan',
        'Bahasa Arab Dasar & Pembiasaan Percakapan',
        'Pengenalan Tokoh & Sejarah Perjuangan Muhammadiyah',
        'Organisasi Otonom Kepanduan Hizbul Wathan (HW)',
        'Bela Diri Tapak Suci Putera Muhammadiyah',
      ],
    },
    {
      id: 'karakter-islami',
      title: 'Karakter Islami',
      description:
        'Pembentukan kepribadian siswa yang berakhlakul karimah, jujur, disiplin, dan santun dalam kehidupan sehari-hari.',
      items: [
        'Penguatan Pendidikan Karakter (PPK)',
        'Profil Pelajar Pancasila Rahmatan Lil Alamin',
        'Pembiasaan Senyum, Sapa, Salam, Sopan, Santun (5S)',
        'Kajian Karakter & Kultum Siswa',
        'Program Infaq Harian & Kepedulian Sosial',
      ],
    },
    {
      id: 'kepemimpinan',
      title: 'Kepemimpinan',
      description:
        'Melatih kepekaan sosial, tanggung jawab, dan jiwa kepemimpinan siswa sejak dini.',
      items: [
        'Latihan Kepemimpinan & Organisasi Dasar Siswa',
        'Kepanduan Hizbul Wathan (HW)',
        'Petugas Upacara Bendera & Piket Kelas',
        'Program Peer Mentoring & Tutoring Sebaya',
        'Kegiatan Bakti Sosial & Kepedulian Lingkungan',
      ],
    },
    {
      id: 'life-skill',
      title: 'Life Skill',
      description:
        'Pembekalan keterampilan praktis kehidupan, kreativitas, dan wawasan teknologi modern.',
      items: [
        'Keterampilan Berpikir Kritis & Problem Solving',
        'Informatika, Computations, & Koding Dasar',
        'Pendidikan Berbasis Lingkungan Hidup (Green School)',
        'Kreativitas Seni, Budaya & Hasta Karya',
        'Keterampilan Mandiri & Kewirausahaan Dasar',
      ],
    },
    {
      id: 'ekstrakurikuler',
      title: 'Ekstrakurikuler',
      description:
        'Wadah pengembangan minat, bakat, dan potensi siswa di bidang olahraga, seni, dan keilmuan.',
      items: [
        'Tapak Suci Putera Muhammadiyah',
        'Hizbul Wathan (HW)',
        'Robotika & Science Club',
        'Seni Kaligrafi, Tilawah & Seni Musik/Drumband',
        'English & Arabic Club',
        'Olahraga (Futsal, Bulutangkis, Panahan)',
      ],
    },
    {
      id: 'pembiasaan-harian',
      title: 'Pembiasaan Harian',
      description:
        'Rutinitas harian untuk membentuk kedisiplinan dan pembiasaan ibadah berkesinambungan.',
      items: [
        'Muroja’ah Bersama & Setoran Tahfidz Harian (07.00 - 07.30)',
        'Shalat Dhuha Berjamaah & Dzikir Pagi',
        'Shalat Dzuhur Berjamaah di Madrasah',
        'Doa Bersama Sebelum & Sesudah Pembelajaran',
        'Kebersihan, Kerapihan, & Gerakan Lihat Sampah Ambil (LISA)',
      ],
    },
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
