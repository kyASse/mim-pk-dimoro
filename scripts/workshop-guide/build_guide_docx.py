from __future__ import annotations

import argparse
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor

from docx_helpers import (
    ACCENT,
    EMERALD,
    EMERALD_HEX,
    MUTED,
    ROW_ALT_HEX,
    SLATE,
    _set_cell_borders,
    _set_cell_margins,
    _set_cell_shading,
    add_body,
    add_callout_box,
    add_chapter_banner,
    add_screenshot_figure,
    add_section_heading,
    add_steps_list,
    add_styled_table,
    configure_a4_document,
)


def _add_cover_page(doc: Document, logo_path: Path) -> None:
    # Top accent bar
    bar = doc.add_table(rows=1, cols=1)
    bar.alignment = WD_TABLE_ALIGNMENT.CENTER
    bar.autofit = False
    c_bar = bar.cell(0, 0)
    c_bar.width = Inches(6.69)
    _set_cell_shading(c_bar, EMERALD_HEX)
    _set_cell_margins(c_bar, top=60, bottom=60, left=100, right=100)
    _set_cell_borders(c_bar, color=EMERALD_HEX, sz="4")
    p_bar = c_bar.paragraphs[0]
    p_bar.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bar.paragraph_format.space_after = Pt(0)
    rb = p_bar.add_run("WORKSHOP PENGELOLAAN WEBSITE RESMI MADRASAH")
    rb.bold = True
    rb.font.size = Pt(9.5)
    rb.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    sp1 = doc.add_paragraph()
    sp1.paragraph_format.space_after = Pt(14)

    if logo_path.exists():
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(10)
        p_logo.add_run().add_picture(str(logo_path), width=Inches(1.45))

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(4)
    ri = p_inst.add_run("MADRASAH IBTIDAIYAH MUHAMMADIYAH PK DIMORO")
    ri.bold = True
    ri.font.size = Pt(12)
    ri.font.color.rgb = ACCENT

    p_sub_inst = doc.add_paragraph()
    p_sub_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub_inst.paragraph_format.space_after = Pt(18)
    rsi = p_sub_inst.add_run("NPSN: 60711720  |  NSM: 111233110050  |  Akreditasi: A\nSudimoro, Parangjoro, Kec. Grogol, Kab. Sukoharjo, Jawa Tengah")
    rsi.font.size = Pt(9.5)
    rsi.font.color.rgb = MUTED

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(6)
    rt = p_title.add_run("BUKU PANDUAN OPERATOR\nPENGELOLAAN WEBSITE SEKOLAH")
    rt.bold = True
    rt.font.size = Pt(22)
    rt.font.color.rgb = EMERALD

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(22)
    rs = p_sub.add_run(
        "Panduan Langkah demi Langkah Panel Admin, Peta Halaman Publik,\n"
        "Status Pengembangan Fitur, dan SOP Keamanan Operasional"
    )
    rs.font.size = Pt(11.5)
    rs.font.color.rgb = MUTED

    add_styled_table(
        doc,
        ["Informasi Dokumen", "Keterangan"],
        [
            ["Nama Sistem", "Portal & Website Resmi MI Muhammadiyah PK Dimoro"],
            ["Alamat Website Resmi", "https://mimpkdimoro.sch.id"],
            ["Tanggal Workshop", "20 November 2026 (Koordinasi Kampus UAD & Pihak Sekolah)"],
            ["Sasaran Pengguna", "Admin Sekolah, Staf Tata Usaha, Guru Pengelola Konten, & Pimpinan"],
            ["Kontak Dukungan Resmi", "Email: admin@mimpkdimoro.sch.id | WhatsApp: +62 821-3388-1991 (Fatim)"],
        ],
        col_widths=[2.3, 4.39],
    )

    # Blank fillable operator note card on cover (no hardcoded credentials)
    add_section_heading(
        doc,
        "Catatan Akun Operator (Diisi Peserta Saat Workshop)",
        "Catat informasi akun operator milik Anda pada kolom di bawah ini. Jangan bagikan kata sandi kepada pihak yang tidak berkepentingan.",
    )
    add_styled_table(
        doc,
        ["Kolom", "Isian Peserta Workshop"],
        [
            ["Nama Operator / Staf", "...................................................................................................."],
            ["Jabatan / Peran", "...................................................................................................."],
            ["Email Akun Admin", "...................................................................................................."],
            ["URL Halaman Login", "https://mimpkdimoro.sch.id/auth/login"],
            ["Catatan Khusus", "...................................................................................................."],
        ],
        col_widths=[2.1, 4.59],
    )

    doc.add_page_break()


def _add_toc_page(doc: Document) -> None:
    add_section_heading(
        doc,
        "Peta Isi Buku Panduan",
        "Gunakan daftar bab berikut untuk mengikuti alur demonstrasi workshop maupun sebagai rujukan cepat di sekolah.",
    )
    add_styled_table(
        doc,
        ["Bab", "Judul & Fokus Bahasan", "Status Fitur"],
        [
            ["Bab 1", "Mengenal Arsitektur Website & Peta 11 Halaman Publik (beserta pemetaan menu Admin)", "Aktif Penuh"],
            ["Bab 2", "Akses Masuk (/auth/login), Dashboard Utama, Navigasi 5 Grup Menu, & Logout", "Aktif Penuh"],
            ["Bab 3", "Kesiswaan & PPDB: Pendaftar PPDB (+ WhatsApp), Data Siswa & Rombel, Biaya & SPP", "Aktif Penuh"],
            ["Bab 4", "Publikasi & Media: Berita & Artikel, Ruang Perspektif, Galeri Foto, Testimoni Wali", "Aktif Penuh"],
            ["Bab 5", "Akademik & Agenda: Kalender Akademik dan Prestasi Siswa", "Aktif Penuh"],
            ["Bab 6", "Komunikasi & Pengaturan: Pesan Masuk, 7 Tab Konten Halaman, dan Kontak Sekolah", "Aktif Penuh"],
            ["Bab 7", "Status Fitur dalam Pengembangan (Roadmap): Seluruh Portal Wali & 3 Menu Admin", "Dalam Pengembangan"],
            ["Bab 8", "Checklist Praktik Workshop di Website Live & SOP Keamanan Harian (Do & Don't)", "Panduan Praktik"],
        ],
        col_widths=[0.8, 4.59, 1.3],
    )
    add_callout_box(
        doc,
        "info",
        "Cara Membaca Panduan Ini",
        [
            "Bab 1 hingga Bab 6 membahas seluruh fitur yang sudah aktif dan siap dikelola secara mandiri oleh pihak sekolah.",
            "Bab 7 menjelaskan secara transparan fitur-fitur yang masih berstatus Dalam Pengembangan agar peserta workshop tidak bingung saat melihatnya.",
            "Bab 8 digunakan langsung saat sesi praktik di https://mimpkdimoro.sch.id bersama instruktur dan dosen pembimbing.",
        ],
    )
    doc.add_page_break()


def _add_chapter_1(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 1",
        "Mengenal Arsitektur Website & Peta Area Publik",
        "Memahami 3 pilar website MIM PK Dimoro dan keterkaitan antara halaman yang dilihat masyarakat dengan menu di Panel Admin.",
    )
    add_body(
        doc,
        "Website resmi MI Muhammadiyah PK Dimoro (https://mimpkdimoro.sch.id) dirancang menjadi tiga area utama agar informasi publik, pengelolaan staf, dan layanan wali murid berjalan rapi:",
    )
    add_steps_list(
        doc,
        [
            ("Area Publik (Aktif Penuh):", "Halaman yang dapat diakses langsung oleh calon wali murid, siswa, dan masyarakat umum tanpa perlu login."),
            ("Panel Admin /admin (Aktif untuk Modul Operasional & Konten):", "Ruang kerja khusus staf sekolah dan pimpinan yang dilindungi akun terverifikasi untuk memperbarui isi website dan mengelola PPDB."),
            ("Portal Wali /portal (Dalam Pengembangan):", "Area khusus orang tua murid yang saat ini seluruh fiturnya masih berstatus dalam tahap pengembangan (dibahas terpisah di Bab 7)."),
        ],
    )

    add_section_heading(
        doc,
        "1.1 Peta 11 Halaman Publik & Menu Admin Pengelolanya",
        "Setiap perubahan yang Anda simpan pada menu Admin tertentu akan otomatis memperbarui tampilan halaman publik terkait.",
    )
    add_styled_table(
        doc,
        ["Halaman Publik", "Alamat URL", "Isi Utama di Halaman", "Menu Admin Pengelola"],
        [
            ["Beranda", "/", "Hero banner, statistik sekolah, keunggulan, berita terbaru, testimoni.", "Konten Halaman (Tab 1), Berita, Testimoni"],
            ["Tentang Kami", "/tentang-kami", "Sambutan Kepala Madrasah, sejarah, visi-misi-motto, identitas, ringkasan pendidik.", "Konten Halaman (Tab 2 & Tab 7)"],
            ["Program", "/program", "Pengantar kurikulum, jam belajar per fase, dan daftar ekstrakurikuler.", "Konten Halaman (Tab 3)"],
            ["Berita", "/berita", "Daftar pengumuman & liputan kegiatan madrasah beserta halaman baca detail.", "Berita & Artikel"],
            ["Ruang Perspektif", "/ruang-perspektif", "Rubrik artikel/opini guru, wali murid, alumni, serta form kirim tulisan (/ruang-perspektif/kirim).", "Ruang Perspektif"],
            ["Galeri Foto", "/galeri", "Dokumentasi foto fasilitas, kegiatan belajar, dan prestasi sekolah.", "Galeri Foto"],
            ["Kalender Akademik", "/kalender-akademik", "Jadwal ujian, hari libur, pembagian rapor, dan agenda resmi sekolah.", "Kalender Akademik"],
            ["Ikatan Wali Murid", "/ikatan-wali-murid", "Profil paguyuban wali murid, pengurus, program kegiatan, dan video.", "Konten Halaman (Tab 6)"],
            ["Struktur Organisasi", "/struktur-organisasi", "Bagan kepemimpinan madrasah, direktori guru, wali kelas, dan staf.", "Konten Halaman (Tab 7)"],
            ["Pendaftaran (PPDB)", "/pendaftaran", "Formulir pendaftaran online calon siswa baru, alur, syarat, jadwal, & rincian biaya.", "Pendaftar PPDB, Biaya & SPP, Konten (Tab 4)"],
            ["Kontak", "/kontak", "Alamat, jam operasional, peta lokasi, daftar FAQ, & formulir kirim pesan.", "Kontak Sekolah, Konten (Tab 5), Pesan Masuk"],
        ],
        col_widths=[1.25, 1.35, 2.39, 1.7],
    )

    add_section_heading(doc, "1.2 Cuplikan Tampilan Halaman Publik Utama")
    add_screenshot_figure(doc, shots / "pub_beranda.png", "Gambar 1.1: Tampilan Halaman Beranda Publik (/) yang dilihat pengunjung pertama kali.")
    add_screenshot_figure(doc, shots / "pub_pendaftaran.png", "Gambar 1.2: Halaman Pendaftaran PPDB Online (/pendaftaran) beserta informasi syarat, jadwal, dan biaya.")
    add_screenshot_figure(doc, shots / "pub_berita.png", "Gambar 1.3: Halaman Publikasi Berita & Artikel (/berita).")
    add_screenshot_figure(doc, shots / "pub_galeri.png", "Gambar 1.4: Halaman Galeri Dokumentasi Kegiatan & Fasilitas (/galeri).")
    add_screenshot_figure(doc, shots / "pub_struktur.png", "Gambar 1.5: Halaman Struktur Organisasi & Direktori Guru/Staf (/struktur-organisasi).")
    add_screenshot_figure(doc, shots / "pub_kontak.png", "Gambar 1.6: Halaman Kontak Sekolah, Peta Lokasi, FAQ, dan Formulir Pesan (/kontak).")
    doc.add_page_break()


def _add_chapter_2(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 2",
        "Akses Masuk, Navigasi Dashboard, & Keamanan Akun",
        "Langkah login ke Panel Admin, membaca ringkasan metrik di Dashboard, navigasi Desktop & HP, serta prosedur logout.",
    )
    add_section_heading(doc, "2.1 Cara Login ke Panel Admin")
    add_steps_list(
        doc,
        [
            ("Buka Halaman Login:", "Akses https://mimpkdimoro.sch.id/auth/login melalui browser di komputer/laptop atau HP."),
            ("Masukkan Kredensial:", "Ketikkan Email resmi akun admin Anda pada kolom Email dan kata sandi pada kolom Password (klik ikon mata untuk memeriksa ketikan kata sandi)."),
            ("Masuk ke Sistem:", "Klik tombol Login. Jika berhasil, sistem akan langsung mengarahkan Anda ke halaman Dashboard Admin (/admin)."),
            ("Jika Lupa Kata Sandi:", "Klik tautan Lupa Password? di halaman login untuk mengirimkan tautan pengaturan ulang kata sandi ke email terdaftar."),
        ],
    )
    add_screenshot_figure(doc, shots / "auth_login.png", "Gambar 2.1: Halaman Login Resmi Portal Admin (/auth/login).")

    add_section_heading(doc, "2.2 Mengenal Dashboard Utama & 5 Grup Menu Sidebar")
    add_body(
        doc,
        "Setelah masuk ke /admin, Anda akan melihat kartu ringkasan pendaftar PPDB, grafik tren pendaftaran harian, kapasitas rombel, serta riwayat aktivitas terbaru (audit log). Di sisi kiri layar (Desktop) terdapat 5 grup menu navigasi:",
    )
    add_styled_table(
        doc,
        ["Grup Menu", "Menu di Dalamnya", "Keterangan Status"],
        [
            ["Utama", "Dashboard (/admin)", "Aktif — ringkasan statistik & akses cepat"],
            ["Kesiswaan & PPDB", "Pendaftar PPDB, Data Siswa, Biaya & SPP", "Aktif — operasional PPDB & kelas"],
            ["Akademik & Agenda", "Kalender Akademik, Prestasi Siswa | (E-Rapor & Laporan)", "Kalender & Prestasi Aktif | E-Rapor Pengembangan"],
            ["Publikasi & Media", "Berita & Artikel, Ruang Perspektif, Galeri Foto, Testimoni Wali", "Aktif — seluruh manajemen publikasi"],
            ["Komunikasi & Pengaturan", "Pesan Masuk, Konten Halaman & Kontak | (Generator Akun/Tools)", "Pesan & Konten Aktif | Tools Pengembangan"],
        ],
        col_widths=[1.5, 3.09, 2.1],
    )
    add_screenshot_figure(doc, shots / "adm_dashboard.png", "Gambar 2.2: Dashboard Utama Admin (/admin) lengkap dengan ringkasan PPDB, rombel, dan sidebar.")

    add_callout_box(
        doc,
        "tips",
        "Akses dari Smartphone & Prosedur Logout",
        [
            "Di layar HP, menu sidebar otomatis berubah menjadi tombol navigasi bawah dan header atas agar tetap nyaman dipakai saat memantau PPDB.",
            "Setelah selesai bekerja (terutama di komputer lab/kantor bersama), selalu klik profil akun Anda di bagian bawah sidebar lalu pilih Keluar (Logout).",
        ],
    )
    doc.add_page_break()


def _add_chapter_3(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 3",
        "Pengelolaan Kesiswaan & PPDB",
        "Memproses calon siswa baru yang mendaftar secara online, mengelola data siswa aktif per rombel, dan memperbarui rincian biaya.",
    )
    add_section_heading(doc, "3.1 Pendaftar PPDB (/admin/pendaftar)")
    add_steps_list(
        doc,
        [
            ("Pantau Daftar Masuk:", "Buka menu Kesiswaan & PPDB -> Pendaftar PPDB untuk melihat seluruh calon siswa yang mengisi formulir di /pendaftaran secara real-time."),
            ("Cari & Filter:", "Gunakan kolom pencarian (nama/asal TK) atau filter status pendaftaran untuk memilah pendaftar yang perlu segera ditindaklanjuti, atau ekspor data tabel bila diperlukan."),
            ("Buka Halaman Detail:", "Klik tombol Detail pada baris calon siswa untuk masuk ke lembar biodata lengkap (/admin/pendaftar/detail/[id])."),
            ("Ubah Status & Hubungi via WhatsApp:", "Pada halaman Detail (sidebar kanan di Desktop atau dock bawah di HP), ubah status seleksi (misal: Pending -> Diproses -> Diterima/Ditolak) dan gunakan tombol WhatsApp untuk menghubungi wali murid dengan format pesan yang sudah disiapkan."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_pendaftar_list.png", "Gambar 3.1: Halaman Daftar Pendaftar PPDB (/admin/pendaftar).")
    add_screenshot_figure(doc, shots / "adm_pendaftar_detail.png", "Gambar 3.2: Halaman Detail Pendaftar (/admin/pendaftar/detail/[id]) dengan kontrol status dan aksi WhatsApp.")

    add_section_heading(doc, "3.2 Data Siswa & Rombel (/admin/siswa)")
    add_steps_list(
        doc,
        [
            ("Kelola Siswa Aktif:", "Buka Data Siswa untuk melihat daftar siswa aktif dan sebaran kelas/rombel (Kelas 1A s.d. 6B)."),
            ("Impor Pendaftar Diterima:", "Pendaftar PPDB yang statusnya sudah Diterima dapat diproses/dimasukkan ke data siswa aktif dan ditempatkan ke rombel."),
            ("Perbarui Data:", "Edit data biodata siswa, pemindahan rombel saat kenaikan kelas, atau keterangan wali murid."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_siswa.png", "Gambar 3.3: Halaman Manajemen Data Siswa & Rombel (/admin/siswa).")

    add_section_heading(doc, "3.3 Biaya & SPP (/admin/akademik/edit-biaya)")
    add_steps_list(
        doc,
        [
            ("Buka Menu Biaya & SPP:", "Pilih Kesiswaan & PPDB -> Biaya & SPP untuk mengatur tabel rincian biaya masuk madrasah."),
            ("Tambah atau Ubah Item Biaya:", "Isi/ubah nama komponen biaya (misal: Seragam, Kegiatan 1 Tahun), nominal untuk Putra, dan nominal untuk Putri (isi 0 jika gratis)."),
            ("Simpan Perubahan:", "Klik Simpan Perubahan agar rincian biaya di halaman publik /pendaftaran langsung terbarui."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_biaya.png", "Gambar 3.4: Halaman Pengelolaan Komponen Biaya & SPP (/admin/akademik/edit-biaya).")
    doc.add_page_break()


def _add_chapter_4(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 4",
        "Pengelolaan Publikasi & Media",
        "Menjaga website tetap hidup dengan berita sekolah terbaru, kurasi tulisan Ruang Perspektif, galeri foto kegiatan, dan testimoni wali.",
    )
    add_section_heading(doc, "4.1 Berita & Artikel (/admin/berita)")
    add_steps_list(
        doc,
        [
            ("Lihat Daftar Berita:", "Buka Publikasi & Media -> Berita & Artikel untuk melihat semua artikel berstatus Dipublikasikan maupun Draft (Draf)."),
            ("Tambah Berita Baru:", "Klik Tambah Berita (/admin/berita/tambah), lalu isi Judul Berita, Ringkasan singkat, Isi Lengkap, dan unggah Gambar Cover (format JPG/PNG/WebP yang rapi)."),
            ("Pilih Status Terbit:", "Pilih Draft (Draf) jika berita masih ingin ditinjau dulu oleh pimpinan, atau pilih Dipublikasikan agar langsung tayang di Beranda dan halaman /berita."),
            ("Edit atau Hapus:", "Gunakan ikon Edit untuk memperbaiki isi artikel atau tombol Hapus (dengan konfirmasi) untuk menghapus artikel yang sudah tidak diperlukan."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_berita_list.png", "Gambar 4.1: Halaman Daftar Berita & Artikel (/admin/berita).")
    add_screenshot_figure(doc, shots / "adm_berita_tambah.png", "Gambar 4.2: Formulir Tambah Berita Baru (/admin/berita/tambah).")

    add_section_heading(doc, "4.2 Ruang Perspektif (/admin/ruang-perspektif)")
    add_steps_list(
        doc,
        [
            ("Tinjau Naskah Masuk:", "Tulisan opini yang dikirim guru, wali murid, alumni, atau masyarakat melalui /ruang-perspektif/kirim masuk ke menu ini dengan status menunggu kurasi."),
            ("Kurasi & Sunting:", "Klik naskah untuk membaca isi lengkap, memperbaiki typo (proofreading), menentukan kategori/penanda unggulan, atau mengisi catatan redaksi."),
            ("Terbitkan atau Tolak:", "Ubah status menjadi Terbit agar tampil di halaman publik /ruang-perspektif, atau Ditolak/Arsip bila tidak memenuhi standar publikasi madrasah."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_ruang_perspektif.png", "Gambar 4.3: Halaman Kurasi Naskah Ruang Perspektif (/admin/ruang-perspektif).")

    add_section_heading(doc, "4.3 Galeri Foto (/admin/galeri) & Testimoni Wali (/admin/testimoni)")
    add_steps_list(
        doc,
        [
            ("Unggah Dokumentasi Galeri:", "Buka Galeri Foto -> Tambah Galeri (/admin/galeri/tambah), pilih file foto kegiatan/fasilitas/prestasi, beri keterangan singkat dan kategori, lalu simpan."),
            ("Kelola Testimoni Wali:", "Buka Testimoni Wali (/admin/testimoni) untuk menambah atau menyunting kutipan testimoni orang tua. Aktifkan sorotan (featured) pada testimoni terbaik agar muncul di halaman Beranda."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_galeri.png", "Gambar 4.4: Halaman Manajemen Galeri Foto (/admin/galeri).")
    add_screenshot_figure(doc, shots / "adm_testimoni.png", "Gambar 4.5: Halaman Manajemen Testimoni Wali Murid (/admin/testimoni).")
    doc.add_page_break()


def _add_chapter_5(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 5",
        "Pengelolaan Akademik & Agenda",
        "Mengelola jadwal kegiatan pada Kalender Akademik dan mencatat capaian Prestasi Siswa agar tampil di website publik.",
    )
    add_section_heading(doc, "5.1 Kalender Akademik (/admin/kalender)")
    add_steps_list(
        doc,
        [
            ("Buka Daftar Agenda:", "Pilih menu Akademik & Agenda -> Kalender Akademik untuk melihat seluruh agenda yang sudah terjadwal."),
            ("Tambah Kegiatan Baru:", "Klik Tambah Kegiatan (/admin/kalender/tambah), lalu isi Judul Kegiatan, Tanggal Mulai, Tanggal Berakhir (opsional), Waktu, Kategori (Ujian/Libur/Agenda Sekolah), Deskripsi, dan Warna label."),
            ("Perbarui atau Hapus:", "Gunakan aksi Edit bila ada pergeseran jadwal madrasah atau Hapus jika kegiatan dibatalkan. Data otomatis tampil di /kalender-akademik."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_kalender.png", "Gambar 5.1: Halaman Pengelolaan Kalender Akademik (/admin/kalender).")

    add_section_heading(doc, "5.2 Prestasi Siswa (/admin/akademik/prestasi)")
    add_steps_list(
        doc,
        [
            ("Catat Kejuaraan Baru:", "Klik Tambah Prestasi (/admin/akademik/prestasi/tambah), isi Nama Prestasi/Lomba, Tahun, Tingkat (Kecamatan/Kabupaten/Provinsi/Nasional), Nama Siswa/Tim, Deskripsi, serta unggah foto dokumentasi/piagam."),
            ("Kelola Arsip Prestasi:", "Gunakan filter tahun atau pencarian di halaman daftar untuk meninjau, menyunting, atau menghapus catatan prestasi."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_prestasi.png", "Gambar 5.2: Halaman Pengelolaan Prestasi Siswa (/admin/akademik/prestasi).")
    doc.add_page_break()


def _add_chapter_6(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 6",
        "Komunikasi & Pengaturan Konten Statis",
        "Menindaklanjuti pesan masuk dari pengunjung dan memperbarui profil sekolah, sambutan, FAQ, hingga struktur organisasi.",
    )
    add_section_heading(doc, "6.1 Pesan Masuk (/admin/pesan)")
    add_steps_list(
        doc,
        [
            ("Pantau Kotak Masuk:", "Setiap pertanyaan yang dikirim masyarakat melalui formulir di halaman /kontak otomatis masuk ke menu Komunikasi & Pengaturan -> Pesan Masuk."),
            ("Baca & Tandai Status:", "Klik pesan untuk membaca nama pengirim, nomor telepon/email, dan isi pertanyaan, lalu tandai statusnya menjadi sudah dibaca/ditindaklanjuti setelah Anda menghubungi penanya."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_pesan.png", "Gambar 6.1: Halaman Kotak Pesan Masuk (/admin/pesan).")

    add_section_heading(doc, "6.2 Pusat Konten Halaman (/admin/konten) — 7 Tab Pengelolaan")
    add_body(
        doc,
        "Menu Konten Halaman adalah pusat pengaturan seluruh teks profil sekolah dan aset halaman publik tanpa perlu menyentuh kode. Di bagian atas halaman terdapat 7 Tab yang masing-masing mengelola bagian berbeda:",
    )
    add_styled_table(
        doc,
        ["Nomor & Nama Tab", "Bagian Website Publik yang Diubah"],
        [
            ["1. Beranda", "Hero banner, 4 kartu statistik utama (jumlah siswa, guru, tahun berdiri, akreditasi), dan kartu pilar keunggulan."],
            ["2. Profil & Sambutan", "Foto & sambutan Kepala Madrasah, Visi-Misi-Motto sekolah, serta identitas/legalitas madrasah."],
            ["3. Program & Ekskul", "Narasi pengantar kurikulum, jam KBM per fase, dan daftar kegiatan ekstrakurikuler (Tapak Suci, HW, dll.)."],
            ["4. PPDB & Dokumen", "Tautan berkas formulir PDF, persyaratan pendaftaran, jadwal gelombang PPDB, catatan SPP, & alur pendaftaran."],
            ["5. Kontak & FAQ", "Info kontak singkat, jam operasional kantor, tautan Google Maps, dan daftar tanya-jawab (FAQ) di halaman Kontak."],
            ["6. Ikatan Wali Murid", "Kata pengantar paguyuban, susunan pengurus, agenda kegiatan wali murid, dan tautan video dokumentasi."],
            ["7. Struktur Organisasi", "Direktori guru & staf pengajar, jajaran pimpinan, daftar wali kelas, dan bagan halaman /struktur-organisasi."],
        ],
        col_widths=[1.85, 4.84],
    )
    add_screenshot_figure(doc, shots / "adm_konten.png", "Gambar 6.2: Pusat Pengelolaan Konten Halaman dengan 7 Tab Navigasi (/admin/konten).")

    add_section_heading(doc, "6.3 Kontak Sekolah (/admin/konten/edit-kontak)")
    add_steps_list(
        doc,
        [
            ("Perbarui Kontak Resmi:", "Buka menu Kontak Sekolah untuk mengubah alamat lengkap, nomor WhatsApp hotline/PPDB, email utama, jam operasional, embed Google Maps, serta tautan media sosial (Facebook, Instagram, YouTube)."),
            ("Simpan Perubahan:", "Klik Simpan agar informasi kontak pada footer, halaman /kontak, dan tombol WhatsApp publik langsung mengikuti data terbaru."),
        ],
    )
    add_screenshot_figure(doc, shots / "adm_kontak.png", "Gambar 6.3: Halaman Edit Informasi Kontak Resmi Sekolah (/admin/konten/edit-kontak).")
    doc.add_page_break()


def _add_chapter_7(doc: Document, shots: Path) -> None:
    add_chapter_banner(
        doc,
        "Bab 7",
        "Status Fitur dalam Pengembangan (Roadmap)",
        "Penjelasan transparan mengenai bagian sistem yang belum dirilis penuh agar pihak sekolah dan dosen pembimbing memiliki acuan yang sama.",
    )
    add_callout_box(
        doc,
        "warning",
        "Penting Disampaikan pada Workshop & Operasional Sekolah",
        [
            "Menu-menu pada bab ini sengaja ditampilkan sebagai kerangka pengembangan sistem ke depan, namun BELUM diaktifkan untuk penggunaan operasional harian saat ini.",
            "Operator sekolah tidak perlu menginput data nilai atau membuat akun orang tua melalui menu di bawah ini sampai ada pemberitahuan rilis resmi dari tim pengembang.",
        ],
    )

    add_section_heading(doc, "7.1 Daftar Modul yang Masih Dalam Pengembangan")
    add_styled_table(
        doc,
        ["Area / Menu", "Alamat Rute", "Status Saat Ini & Keterangan"],
        [
            ["Seluruh Fitur Portal Wali", "/portal/* (Akademik, Keuangan, Laporan, Pengumuman, Testimoni)", "Dalam Pengembangan — belum dibuka untuk wali murid secara produksi."],
            ["E-Rapor & Manajemen Nilai", "/admin/akademik", "Under Development (65%) — rencana input nilai Kurikulum Merdeka & cetak PDF rapor."],
            ["Laporan Perkembangan", "/admin/akademik/laporan", "Under Development — rencana rekap catatan perkembangan belajar siswa."],
            ["Generator Akun / Tools", "/admin/tools", "Under Development (75%) — utilitas pengembang & simulasi akun portal."],
        ],
        col_widths=[1.8, 1.85, 3.04],
    )

    add_screenshot_figure(doc, shots / "dev_erapor.png", "Gambar 7.1: Contoh tampilan halaman Under Development pada menu E-Rapor (/admin/akademik).")
    add_screenshot_figure(doc, shots / "dev_portal_wali.png", "Gambar 7.2: Pratinjau kerangka Portal Wali (/portal) yang seluruh fiturnya masih dalam tahap pengembangan.")
    doc.add_page_break()


def _add_chapter_8(doc: Document) -> None:
    add_chapter_banner(
        doc,
        "Bab 8",
        "Checklist Praktik Workshop & SOP Operasional",
        "Panduan latihan langsung peserta workshop di https://mimpkdimoro.sch.id beserta aturan keamanan harian bagi operator sekolah.",
    )
    add_callout_box(
        doc,
        "danger",
        "Aturan Keamanan Produksi Saat Praktik Workshop (WAJIB DIPATUHI)",
        [
            "Karena latihan dilakukan langsung pada website produksi (https://mimpkdimoro.sch.id), peserta DILARANG mengubah status pendaftar PPDB asli atau menekan kirim pesan WhatsApp ke wali murid asli.",
            "Saat mencoba fitur Tambah Berita, status WAJIB dipilih sebagai Draft (Draf) — jangan pilih Dipublikasikan — dan hapus kembali draf latihan tersebut setelah selesai mengeceknya di daftar.",
            "Jangan menghapus atau menimpa data berita, galeri, kalender, maupun konten profil asli yang sudah tayang.",
        ],
    )

    add_section_heading(
        doc,
        "8.1 Skenario Latihan Mandiri Workshop (Estimasi 15–20 Menit)",
        "Berikan tanda centang [v] pada kolom Cek setelah Anda menyelesaikan setiap langkah praktik di bawah ini.",
    )
    add_styled_table(
        doc,
        ["No", "Langkah Praktik di https://mimpkdimoro.sch.id", "Hasil yang Diharapkan", "Cek"],
        [
            ["1", "Buka https://mimpkdimoro.sch.id/auth/login dan login memakai akun admin sekolah masing-masing.", "Berhasil masuk ke Dashboard Admin (/admin) dan melihat kartu metrik.", "[  ]"],
            ["2", "Buka Pendaftar PPDB -> klik Detail pada satu baris pendaftar (hanya membaca, jangan ubah status/kirim WA).", "Memahami letak biodata calon siswa, status seleksi, dan tombol WhatsApp.", "[  ]"],
            ["3", "Buka Berita & Artikel -> Tambah Berita. Isi judul uji coba (mis. '[LATIHAN] Tes Workshop'), pilih Status: Draft (Draf), lalu Simpan.", "Artikel tersimpan aman sebagai draf dan tidak muncul di halaman publik /berita.", "[  ]"],
            ["4", "Temukan artikel '[LATIHAN] Tes Workshop' di daftar Berita Admin, lalu klik Hapus dan konfirmasi.", "Data latihan bersih kembali dari database produksi.", "[  ]"],
            ["5", "Buka Konten Halaman (/admin/konten) dan klik Tab 1 s.d. Tab 7 (tinjau tanpa menyimpan perubahan).", "Memahami lokasi edit profil, PPDB, FAQ, IKWM, dan Struktur Organisasi.", "[  ]"],
            ["6", "Buka Pesan Masuk (/admin/pesan) untuk melihat struktur daftar pesan dari halaman Kontak.", "Mengetahui cara memantau pertanyaan masyarakat yang masuk.", "[  ]"],
            ["7", "Klik ikon profil di bagian bawah sidebar lalu tekan Keluar (Logout).", "Sesi login tertutup aman dan browser kembali ke halaman login/publik.", "[  ]"],
        ],
        col_widths=[0.4, 2.95, 2.74, 0.6],
    )

    add_section_heading(doc, "8.2 Aturan Emas (Do & Don't) Operator Harian")
    add_styled_table(
        doc,
        ["Lakukan (Do)", "Hindari (Don't)"],
        [
            [
                "Periksa ulang ejaan, tanggal, dan nominal biaya sebelum menekan Simpan atau Dipublikasikan.",
                "Jangan langsung klik Hapus tanpa membaca nama data; penghapusan di database bersifat permanen.",
            ],
            [
                "Gunakan gambar beresolusi baik namun berukuran ringan (disarankan di bawah 1–2 MB, rasio mendatar untuk berita).",
                "Jangan mengunggah foto mentah kamera berukuran belasan MB yang membuat halaman lambat dibuka wali murid.",
            ],
            [
                "Selalu Logout setelah selesai bekerja, terutama jika memakai komputer tata usaha atau perangkat bersama.",
                "Jangan membagikan email & kata sandi akun Admin di grup chat umum atau menuliskannya di tempat terbuka.",
            ],
            [
                "Gunakan status Draft (Draf) untuk berita yang masih menunggu persetujuan Kepala Madrasah.",
                "Jangan menguji coba input data acak di menu produksi dengan status Dipublikasikan.",
            ],
        ],
        col_widths=[3.34, 3.35],
    )

    add_callout_box(
        doc,
        "tips",
        "Kontak Bantuan Teknis Setelah Workshop",
        [
            "Jika mengalami kendala login, lupa password yang tidak berhasil dipulihkan, atau menemukan error tampilan saat mengelola website:",
            "Hubungi Tim Pengelola / Dukungan Teknis via Email admin@mimpkdimoro.sch.id atau WhatsApp +62 821-3388-1991 (Narahubung: Fatim) dengan menyertakan tangkapan layar (screenshot) kendala.",
        ],
    )


def generate_guide_docx(output_path: Path, screenshots_dir: Path, logo_path: Path) -> Path:
    """Assemble the complete workshop handbook .docx and write it to output_path."""
    doc = Document()
    configure_a4_document(doc)

    _add_cover_page(doc, logo_path)
    _add_toc_page(doc)
    _add_chapter_1(doc, screenshots_dir)
    _add_chapter_2(doc, screenshots_dir)
    _add_chapter_3(doc, screenshots_dir)
    _add_chapter_4(doc, screenshots_dir)
    _add_chapter_5(doc, screenshots_dir)
    _add_chapter_6(doc, screenshots_dir)
    _add_chapter_7(doc, screenshots_dir)
    _add_chapter_8(doc)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    return output_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Build MIM PK Dimoro workshop operator handbook (.docx).")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("docs/panduan-workshop/Panduan_Pengelolaan_Website_MIM_Dimoro.docx"),
    )
    parser.add_argument(
        "--screenshots-dir",
        type=Path,
        default=Path("docs/panduan-workshop/screenshots"),
    )
    parser.add_argument(
        "--logo",
        type=Path,
        default=Path("public/logo-mim-pk-dimoro.png"),
    )
    args = parser.parse_args()

    out = generate_guide_docx(args.output, args.screenshots_dir, args.logo)
    print(f"Generated DOCX: {out} ({out.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
