# Pembaharuan Data Sekolah MIM Dimoro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement updated school information from 5 official PDF documents into `lib/school-data.ts` and integrate them across Beranda (`/`), Tentang Kami (`/tentang-kami`), and Program (`/program`) pages on branch `feat/pembaharuan-data-sekolah`.

**Architecture:** Create a strongly-typed, centralized data layer in `lib/school-data.ts` housing complete texts for Headmaster Welcome, Vision & Mission (with indicators), 8-Pillar Integrated Curriculum, Excellent Programs (Tahfidz & Klinik Belajar), and Competent Educators. Wire these structures directly into Next.js React Server & Client Components across the app.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React, Shadcn/UI, Vitest.

---

### Task 1: Centralized Data Layer (`lib/school-data.ts` & Tests)

**Files:**
- Create: `lib/school-data.ts`
- Create: `lib/__tests__/school-data.test.ts`

- [ ] **Step 1: Write unit tests for `lib/school-data.ts`**

```typescript
// lib/__tests__/school-data.test.ts
import { describe, it, expect } from "vitest";
import {
  HEADMASTER_WELCOME,
  VISION_MISSION,
  EXCELLENT_PROGRAMS,
  INTEGRATED_CURRICULUM,
  COMPETENT_EDUCATORS,
} from "../school-data";

describe("School Data Layer", () => {
  it("contains headmaster welcome details", () => {
    expect(HEADMASTER_WELCOME.name).toBe("Hj. Anik Sulityowati, S.Ag.");
    expect(HEADMASTER_WELCOME.title).toBe("Kepala MI Muhammadiyah Dimoro");
    expect(HEADMASTER_WELCOME.paragraphs.length).toBeGreaterThanOrEqual(5);
  });

  it("contains vision, 7 vision indicators, and 8 mission points", () => {
    expect(VISION_MISSION.vision).toContain("Terwujudnya generasi Islami");
    expect(VISION_MISSION.visionIndicators).toHaveLength(7);
    expect(VISION_MISSION.missions).toHaveLength(8);
  });

  it("contains excellent programs details for Tahfidz and Klinik Belajar", () => {
    expect(EXCELLENT_PROGRAMS.tahfidz.title).toBe("Program Tahfidz Al-Qur'an");
    expect(EXCELLENT_PROGRAMS.tahfidz.targets).toContain("Memiliki hafalan minimal 1 juz saat lulus.");
    expect(EXCELLENT_PROGRAMS.klinikBelajar.title).toBe("Klinik Belajar");
    expect(EXCELLENT_PROGRAMS.graduateProfiles).toHaveLength(6);
  });

  it("contains 8-pillar integrated curriculum data", () => {
    expect(INTEGRATED_CURRICULUM.pillars).toHaveLength(8);
  });

  it("contains competent educators programs and commitments", () => {
    expect(COMPETENT_EDUCATORS.programs).toHaveLength(8);
    expect(COMPETENT_EDUCATORS.commitments).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/school-data.test.ts`
Expected: FAIL with module `../school-data` not found.

- [ ] **Step 3: Create `lib/school-data.ts` with complete data from 5 PDFs**

```typescript
// lib/school-data.ts

export interface HeadmasterWelcome {
  name: string;
  title: string;
  greeting: string;
  paragraphs: string[];
  summary: string[];
  photoUrl: string;
}

export interface VisionMissionData {
  vision: string;
  visionIndicators: string[];
  missions: string[];
}

export interface ExcellentProgramDetails {
  title: string;
  tagline?: string;
  objective: string;
  targetAudience?: string[];
  activities?: string[];
  targets?: string[];
  expectations?: string;
  learningApproaches?: string[];
}

export interface ExcellentProgramsData {
  tahfidz: ExcellentProgramDetails;
  klinikBelajar: ExcellentProgramDetails;
  graduateProfiles: string[];
}

export interface CurriculumPillar {
  id: string;
  title: string;
  description?: string;
  items: string[];
}

export interface IntegratedCurriculumData {
  title: string;
  description: string;
  pillars: CurriculumPillar[];
}

export interface EducatorProgram {
  id: number;
  title: string;
  description: string;
}

export interface CompetentEducatorsData {
  title: string;
  description: string;
  programs: EducatorProgram[];
  commitments: string[];
}

export const HEADMASTER_WELCOME: HeadmasterWelcome = {
  name: "Hj. Anik Sulityowati, S.Ag.",
  title: "Kepala MI Muhammadiyah Dimoro",
  greeting: "Assalamu'alaikum warahmatullahi wabarakatuh.",
  summary: [
    "Alhamdulillahirabbil 'alamin, segala puji hanya milik Allah SWT yang telah melimpahkan rahmat dan hidayah-Nya kepada kita semua. Selamat datang di Website Resmi MI Muhammadiyah Dimoro.",
    "Website ini kami hadirkan sebagai sarana informasi, komunikasi, dan silaturahmi. Kami berkomitmen untuk terus memberikan pelayanan pendidikan yang berkualitas berlandaskan nilai-nilai Islam dan semangat Muhammadiyah."
  ],
  paragraphs: [
    "Alhamdulillahirabbil 'alamin, segala puji hanya milik Allah SWT yang telah melimpahkan rahmat, taufik, dan hidayah-Nya kepada kita semua. Shalawat serta salam semoga senantiasa tercurah kepada junjungan kita Nabi Muhammad SAW, beserta keluarga, sahabat, dan seluruh umatnya hingga akhir zaman.",
    "Selamat datang di Website Resmi MI Muhammadiyah Dimoro.",
    "Website ini kami hadirkan sebagai sarana informasi, komunikasi, dan silaturahmi antara madrasah dengan peserta didik, orang tua, alumni, masyarakat, serta seluruh pihak yang memiliki kepedulian terhadap kemajuan pendidikan. Di era digital saat ini, keterbukaan informasi menjadi salah satu kebutuhan penting dalam membangun lembaga pendidikan yang profesional, modern, dan terpercaya.",
    "Melalui website ini, kami berharap masyarakat dapat mengenal lebih dekat MI Muhammadiyah Dimoro, mulai dari profil madrasah, program unggulan, kegiatan peserta didik, prestasi, informasi penerimaan peserta didik baru (PPDB), hingga berbagai layanan yang kami sediakan. Kami berkomitmen untuk terus memberikan pelayanan pendidikan yang berkualitas dengan berlandaskan nilai-nilai Islam dan semangat Muhammadiyah, sehingga mampu mencetak generasi yang cerdas dalam ilmu, mulia dalam akhlak, berprestasi, serta siap menghadapi tantangan masa depan.",
    "Kami menyadari bahwa website ini masih memerlukan penyempurnaan. Oleh karena itu, kritik, saran, dan masukan yang membangun sangat kami harapkan demi peningkatan kualitas layanan informasi madrasah.",
    "Terima kasih kepada seluruh pihak yang telah mendukung pengembangan website ini. Semoga kehadiran website MI Muhammadiyah Dimoro memberikan manfaat yang sebesar-besarnya bagi dunia pendidikan dan menjadi media dakwah serta syiar Islam yang membawa keberkahan.",
    "Wassalamu'alaikum warahmatullahi wabarakatuh."
  ],
  photoUrl: "https://placehold.co/600x800/059669/ffffff.png?text=Hj.+Anik+Sulityowati,+S.Ag."
};

export const VISION_MISSION: VisionMissionData = {
  vision: "Terwujudnya generasi Islami yang Berakhlakul Karimah, Unggul dalam Prestasi, Cinta Al-Qur'an, Berwawasan Global, Peduli Lingkungan, dan Berkemajuan.",
  visionIndicators: [
    "Beriman dan bertakwa kepada Allah SWT.",
    "Berakhlakul karimah dalam kehidupan sehari-hari.",
    "Memiliki kemampuan membaca dan menghafal Al-Qur'an.",
    "Unggul dalam prestasi akademik maupun nonakademik.",
    "Menguasai literasi, numerasi, teknologi, dan komunikasi.",
    "Memiliki jiwa kepemimpinan, kemandirian, serta kepedulian sosial.",
    "Mencintai lingkungan dan budaya hidup bersih."
  ],
  missions: [
    "Menyelenggarakan pendidikan Islam yang berlandaskan Al-Qur'an dan As-Sunnah.",
    "Membiasakan ibadah, akhlak mulia, dan budaya Islami dalam kehidupan sehari-hari.",
    "Mengembangkan pembelajaran aktif, kreatif, inovatif, menyenangkan, dan berbasis teknologi.",
    "Menumbuhkan budaya literasi, numerasi, riset sederhana, dan berpikir kritis.",
    "Mengembangkan potensi akademik, olahraga, seni, dan keterampilan peserta didik.",
    "Mewujudkan madrasah yang bersih, sehat, ramah anak, dan peduli lingkungan.",
    "Menjalin kemitraan yang harmonis dengan orang tua, masyarakat, dan Persyarikatan Muhammadiyah.",
    "Membentuk peserta didik yang cinta tanah air, toleran, disiplin, mandiri, dan siap menghadapi tantangan masa depan."
  ]
};

export const EXCELLENT_PROGRAMS: ExcellentProgramsData = {
  tahfidz: {
    title: "Program Tahfidz Al-Qur'an",
    tagline: "Menumbuhkan kecintaan peserta didik terhadap Al-Qur'an",
    objective: "Menumbuhkan kecintaan peserta didik terhadap Al-Qur'an serta membentuk generasi yang berakhlak mulia melalui pembiasaan membaca, menghafal, memahami, dan mengamalkan nilai-nilai Al-Qur'an.",
    activities: [
      "Tahfidz dengan metode yang menyenangkan dan bertahap.",
      "Setoran hafalan setiap hari.",
      "Murajaah (mengulang hafalan) secara terjadwal.",
      "Pendampingan hafalan oleh guru tahfidz.",
      "Tasmi' hafalan setiap akhir semester.",
      "Wisuda Tahfidz sebagai bentuk apresiasi.",
      "Pelibatan orang tua melalui buku kontrol hafalan di rumah."
    ],
    targets: [
      "Mampu membaca Al-Qur'an dengan tartil.",
      "Memiliki hafalan minimal 1 juz saat lulus.",
      "Terbiasa menjaga hafalan melalui murajaah.",
      "Memiliki karakter Qur'ani dalam kehidupan sehari-hari."
    ]
  },
  klinikBelajar: {
    title: "Klinik Belajar",
    tagline: "Pendampingan khusus agar tidak ada anak yang tertinggal",
    objective: "Memberikan pendampingan khusus kepada peserta didik yang mengalami kesulitan belajar sehingga tidak ada anak yang tertinggal dalam proses pembelajaran.",
    targetAudience: [
      "Peserta didik yang belum mencapai tujuan pembelajaran.",
      "Peserta didik yang memerlukan penguatan literasi dan numerasi.",
      "Peserta didik yang membutuhkan pendampingan belajar secara intensif."
    ],
    activities: [
      "Identifikasi kemampuan belajar setiap siswa.",
      "Kelas remedial terjadwal.",
      "Pendampingan belajar dalam kelompok kecil.",
      "Bimbingan belajar secara individual sesuai kebutuhan.",
      "Penguatan kemampuan membaca, menulis, dan berhitung.",
      "Pendampingan penyelesaian tugas sekolah.",
      "Komunikasi rutin dengan orang tua mengenai perkembangan belajar anak.",
      "Evaluasi berkala untuk memantau peningkatan hasil belajar."
    ],
    expectations: "Setiap peserta didik memperoleh kesempatan belajar yang optimal, meningkatkan rasa percaya diri, serta mampu mencapai kompetensi sesuai tahap perkembangannya.",
    learningApproaches: [
      "Pembelajaran yang aktif, kreatif, inovatif, dan menyenangkan.",
      "Pendampingan sesuai kebutuhan dan kemampuan masing-masing peserta didik.",
      "Kolaborasi antara guru, orang tua, dan madrasah.",
      "Pemanfaatan media pembelajaran yang variatif.",
      "Evaluasi perkembangan secara berkala."
    ]
  },
  graduateProfiles: [
    "Beriman dan bertakwa kepada Allah SWT.",
    "Mampu membaca Al-Qur'an dengan baik serta memiliki hafalan minimal 1 juz.",
    "Memiliki akhlakul karimah dan karakter Islami.",
    "Menguasai kompetensi akademik sesuai potensinya.",
    "Percaya diri, mandiri, dan memiliki semangat belajar sepanjang hayat.",
    "Siap melanjutkan pendidikan ke jenjang berikutnya dengan bekal ilmu, iman, dan akhlak."
  ]
};

export const INTEGRATED_CURRICULUM: IntegratedCurriculumData = {
  title: "Kurikulum Terpadu Berbasis Nilai Keislaman dan Kemuhammadiyahan",
  description: "MI Muhammadiyah Dimoro menerapkan Kurikulum Nasional (Kurikulum Merdeka) yang dipadukan dengan pendidikan keislaman, nilai-nilai Kemuhammadiyahan, penguatan karakter, serta pembiasaan budaya Islami. Kurikulum ini dirancang untuk membentuk peserta didik yang unggul dalam akademik, berakhlakul karimah, berwawasan global, serta memiliki karakter Islami sesuai tuntunan Al-Qur'an dan As-Sunnah.",
  pillars: [
    {
      id: "akademik",
      title: "Penguatan Akademik",
      description: "Program akademik diselenggarakan sesuai Kurikulum Merdeka dengan pembelajaran yang aktif, kreatif, inovatif, dan menyenangkan.",
      items: [
        "Pembelajaran berbasis proyek (Project Based Learning).",
        "Penguatan Literasi dan Numerasi.",
        "Pembelajaran berbasis teknologi (Digital Learning).",
        "English Day.",
        "Arabic Fun Learning.",
        "Klinik Belajar.",
        "Pembinaan Olimpiade dan Kompetisi."
      ]
    },
    {
      id: "al-islam",
      title: "Penguatan Al-Islam",
      description: "Pendidikan Al-Islam menjadi ciri khas utama MIM Dimoro melalui berbagai program pembiasaan dan pembelajaran.",
      items: [
        "Tahfidz Al-Qur'an dengan target hafalan minimal 1 juz saat lulus.",
        "BTQ (Baca Tulis Al-Qur'an).",
        "Praktik ibadah sesuai tuntunan Rasulullah SAW.",
        "Hafalan doa-doa harian.",
        "Hafalan hadis pilihan.",
        "Hafalan Asmaul Husna.",
        "Kultum siswa.",
        "Imam Cilik.",
        "Shalat Dhuha berjamaah.",
        "Shalat Zuhur berjamaah.",
        "Pesantren Ramadhan.",
        "Mabit (Malam Bina Iman dan Takwa)."
      ]
    },
    {
      id: "kemuhammadiyahan",
      title: "Penguatan Kemuhammadiyahan",
      description: "Pembelajaran Kemuhammadiyahan bertujuan menanamkan nilai perjuangan Muhammadiyah sejak dini.",
      items: [
        "Mata pelajaran ISMUBA.",
        "Sejarah Muhammadiyah.",
        "Keteladanan KH. Ahmad Dahlan dan Nyai Ahmad Dahlan.",
        "Pengenalan Amal Usaha Muhammadiyah (AUM).",
        "Penguatan Ideologi Muhammadiyah.",
        "Hizbul Wathan (HW).",
        "Kegiatan bakti sosial Muhammadiyah.",
        "Perayaan Milad Muhammadiyah.",
        "Praktik hidup sesuai nilai Islam Berkemajuan."
      ]
    },
    {
      id: "karakter",
      title: "Penguatan Karakter Islami",
      description: "Karakter peserta didik dibangun melalui pembiasaan sehari-hari.",
      items: [
        "Budaya 5S (Senyum, Salam, Sapa, Sopan, Santun).",
        "Gerakan 7 Kebiasaan Anak Indonesia Hebat.",
        "Disiplin waktu.",
        "Kejujuran.",
        "Tanggung jawab.",
        "Kepedulian sosial.",
        "Cinta orang tua dan guru.",
        "Cinta Al-Qur'an.",
        "Jumat Berkah.",
        "Sedekah rutin.",
        "Parenting bersama orang tua."
      ]
    },
    {
      id: "kepemimpinan",
      title: "Penguatan Kepemimpinan",
      description: "Program kepemimpinan dikembangkan melalui pengalaman nyata.",
      items: [
        "Organisasi siswa.",
        "Petugas upacara.",
        "Petugas apel pagi.",
        "Kultum bergilir.",
        "Imam Cilik.",
        "Latihan Kepemimpinan Dasar.",
        "Presentasi kelas."
      ]
    },
    {
      id: "lifeskill",
      title: "Penguatan Life Skill",
      description: "Peserta didik dibekali berbagai keterampilan hidup.",
      items: [
        "Market Day.",
        "Cooking Class.",
        "Berkebun.",
        "Bank Sampah.",
        "Green School.",
        "Pengelolaan lingkungan.",
        "Literasi digital.",
        "Kewirausahaan sederhana."
      ]
    },
    {
      id: "ekstrakurikuler",
      title: "Penguatan Ekstrakurikuler",
      description: "Ekstrakurikuler menjadi wadah pengembangan minat dan bakat.",
      items: [
        "Hizbul Wathan.",
        "Tapak Suci.",
        "Tahfidz.",
        "Hadrah.",
        "Pramuka.",
        "Komputer.",
        "English Club.",
        "Arabic Club.",
        "Sains Club."
      ]
    },
    {
      id: "pembiasaan",
      title: "Pembiasaan Harian",
      description: "Budaya madrasah diterapkan setiap hari melalui kegiatan rutin.",
      items: [
        "Penyambutan siswa oleh guru.",
        "Salam dan berjabat tangan.",
        "Membaca doa sebelum dan sesudah belajar.",
        "Tadarus Al-Qur'an.",
        "Murajaah hafalan.",
        "Shalat Dhuha.",
        "Shalat Zuhur berjamaah.",
        "Kultum bergilir.",
        "Menjaga kebersihan kelas.",
        "Sedekah Jumat.",
        "Membaca buku 15 menit setiap hari."
      ]
    }
  ]
};

export const COMPETENT_EDUCATORS: CompetentEducatorsData = {
  title: "Pendidik Berkompeten",
  description: "Dibimbing oleh guru-guru yang berdedikasi, profesional, dan ahli di bidangnya untuk memberikan layanan pendidikan terbaik bagi setiap peserta didik.",
  programs: [
    {
      id: 1,
      title: "Pengembangan Profesional Guru",
      description: "Meningkatkan kompetensi guru melalui pelatihan, seminar, workshop, dan kegiatan Kelompok Kerja Guru (KKG) secara berkelanjutan."
    },
    {
      id: 2,
      title: "Pembelajaran Aktif dan Inovatif",
      description: "Guru menerapkan pembelajaran yang kreatif, menyenangkan, dan berpusat pada peserta didik dengan memanfaatkan berbagai metode serta media pembelajaran yang menarik."
    },
    {
      id: 3,
      title: "Pendampingan Belajar Siswa",
      description: "Guru memberikan pendampingan secara intensif melalui Klinik Belajar bagi peserta didik yang memerlukan penguatan materi maupun bimbingan belajar."
    },
    {
      id: 4,
      title: "Pendampingan Tahfidz Al-Qur'an",
      description: "Guru Tahfidz membimbing peserta didik dalam tahsin, setoran hafalan, murajaah, serta membangun kecintaan terhadap Al-Qur'an melalui pembiasaan yang berkelanjutan."
    },
    {
      id: 5,
      title: "Pembinaan Karakter Islami",
      description: "Guru menjadi teladan dalam akhlak, kedisiplinan, dan ibadah, serta membimbing peserta didik melalui pembiasaan nilai-nilai Islam dalam kehidupan sehari-hari."
    },
    {
      id: 6,
      title: "Pemanfaatan Teknologi dalam Pembelajaran",
      description: "Guru memanfaatkan media digital dan teknologi informasi untuk menciptakan pembelajaran yang interaktif, efektif, dan sesuai dengan perkembangan zaman."
    },
    {
      id: 7,
      title: "Kolaborasi dengan Orang Tua",
      description: "Guru menjalin komunikasi yang aktif dengan orang tua untuk memantau perkembangan akademik, karakter, dan hafalan Al-Qur'an peserta didik."
    },
    {
      id: 8,
      title: "Evaluasi dan Pendampingan Berkala",
      description: "Guru melakukan asesmen secara berkala untuk mengetahui perkembangan belajar siswa serta menyusun tindak lanjut berupa pengayaan maupun remedial sesuai kebutuhan."
    }
  ],
  commitments: [
    "Mengajar dengan hati, mendidik dengan keteladanan.",
    "Mengembangkan potensi setiap peserta didik tanpa membedakan kemampuan.",
    "Menciptakan lingkungan belajar yang aman, nyaman, dan menyenangkan.",
    "Menjadi pembelajar sepanjang hayat dengan terus meningkatkan kompetensi profesional, pedagogik, sosial, dan kepribadian.",
    "Bersinergi dengan orang tua dalam mewujudkan generasi yang cerdas dalam ilmu, mulia dalam akhlak, dan berprestasi."
  ]
};
```

- [ ] **Step 4: Run unit test to verify it passes**

Run: `npx vitest run lib/__tests__/school-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit task 1**

```bash
git add lib/school-data.ts lib/__tests__/school-data.test.ts
git commit -m "feat: add centralized school data layer from 5 PDFs"
```

---

### Task 2: Update Home Page (`components/home/AboutSection.tsx` & `ProgramSection.tsx`)

**Files:**
- Modify: `components/home/AboutSection.tsx`
- Modify: `components/home/ProgramSection.tsx`

- [ ] **Step 1: Integrate Headmaster Welcome & Program Data in Home components**

Update `components/home/AboutSection.tsx` to display Sambutan Kepala Sekolah Hj. Anik Sulityowati, S.Ag. (summary) with link to `/tentang-kami`.

- [ ] **Step 2: Run ESLint & Type Check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit task 2**

```bash
git add components/home/AboutSection.tsx components/home/ProgramSection.tsx
git commit -m "feat: integrate headmaster welcome summary and updated programs in home page"
```

---

### Task 3: Update Tentang Kami Page (`app/tentang-kami/page.tsx`)

**Files:**
- Modify: `app/tentang-kami/page.tsx`
- Create/Modify: `components/tentang-kami/VisionMission.tsx`
- Create/Modify: `components/tentang-kami/EducatorsSection.tsx`

- [ ] **Step 1: Update `app/tentang-kami/page.tsx` with full Sambutan, Vision & 7 Indicators, 8 Missions, Graduate Profiles, and 8 Educator Programs + 5 Commitments**

- [ ] **Step 2: Run ESLint & Type Check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit task 3**

```bash
git add app/tentang-kami/page.tsx components/tentang-kami/
git commit -m "feat: update tentang-kami page with full headmaster welcome, vision indicators, and educators data"
```

---

### Task 4: Update Program Page (`app/program/page.tsx`)

**Files:**
- Modify: `app/program/page.tsx`
- Create/Modify: `components/program/IntegratedCurriculumSection.tsx`

- [ ] **Step 1: Update `app/program/page.tsx` with 8-Pillar Integrated Curriculum Tabs and Detailed Tahfidz & Klinik Belajar Sections**

- [ ] **Step 2: Run ESLint & Type Check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit task 4**

```bash
git add app/program/page.tsx components/program/
git commit -m "feat: update program page with 8-pillar integrated curriculum tabs and detailed excellent programs"
```

---

### Task 5: Complete Verification & Final Checks

- [ ] **Step 1: Run complete test suite**
Run: `npm test`
Expected: ALL PASS

- [ ] **Step 2: Run Next.js build verification**
Run: `npx next build`
Expected: Build succeeds with 0 errors.
