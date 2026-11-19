import struct
import sys
import tempfile
import unittest
import zlib
from pathlib import Path

from docx import Document
from docx.shared import Inches

sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_guide_docx import generate_guide_docx
from verify_screenshots import REQUIRED_KEYS


def _make_png(width: int, height: int) -> bytes:
    """Create a minimal valid RGBA PNG of the given dimensions using stdlib only."""
    raw_row = b"\x00" + (b"\x0f\x76\x6e\xff" * width)
    raw = raw_row * height

    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b"")


SAMPLE_PNG = _make_png(160, 100)


def _extract_all_text(doc: Document) -> str:
    parts: list[str] = [p.text for p in doc.paragraphs]
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                parts.append(cell.text)
    for section in doc.sections:
        for container in (section.header, section.footer):
            for p in container.paragraphs:
                parts.append(p.text)
            for table in container.tables:
                for row in table.rows:
                    for cell in row.cells:
                        parts.append(cell.text)
    return "\n".join(parts)


class TestBuildGuideDocx(unittest.TestCase):
    def _build_temp_doc(self) -> tuple[Path, Document]:
        self.tmpdir = tempfile.TemporaryDirectory()
        tmp = Path(self.tmpdir.name)
        shots = tmp / "screenshots"
        shots.mkdir()
        for key in REQUIRED_KEYS:
            (shots / f"{key}.png").write_bytes(SAMPLE_PNG)
        logo = tmp / "logo.png"
        logo.write_bytes(SAMPLE_PNG)
        out = tmp / "guide.docx"
        generate_guide_docx(out, shots, logo)
        return out, Document(str(out))

    def tearDown(self):
        if hasattr(self, "tmpdir"):
            self.tmpdir.cleanup()

    def test_generated_docx_contains_all_chapters_and_public_mapping(self):
        _, doc = self._build_temp_doc()
        full_text = _extract_all_text(doc)

        for chapter in [
            "Bab 1",
            "Bab 2",
            "Bab 3",
            "Bab 4",
            "Bab 5",
            "Bab 6",
            "Bab 7",
            "Bab 8",
        ]:
            self.assertIn(chapter, full_text, f"Missing {chapter}")

        for route in [
            "/",
            "/tentang-kami",
            "/program",
            "/berita",
            "/ruang-perspektif",
            "/galeri",
            "/kalender-akademik",
            "/ikatan-wali-murid",
            "/struktur-organisasi",
            "/pendaftaran",
            "/kontak",
        ]:
            self.assertIn(route, full_text, f"Missing public route {route}")

        self.assertIn("Portal Wali", full_text)
        self.assertIn("E-Rapor", full_text)
        self.assertIn("Laporan Perkembangan", full_text)
        self.assertIn("Generator Akun", full_text)
        self.assertIn("Draft (Draf)", full_text)
        self.assertIn("Struktur Organisasi", full_text)

    def test_generated_docx_never_leaks_local_credentials_or_localhost(self):
        _, doc = self._build_temp_doc()
        full_text = _extract_all_text(doc)

        for forbidden in ["admin123", "orangtua123", "127.0.0.1", "localhost:3000"]:
            self.assertNotIn(forbidden, full_text, f"Forbidden local token leaked: {forbidden}")
        self.assertIn("https://mimpkdimoro.sch.id", full_text)

    def test_generated_docx_embeds_all_screenshots_within_page_width(self):
        _, doc = self._build_temp_doc()
        self.assertGreaterEqual(len(doc.inline_shapes), len(REQUIRED_KEYS))
        max_emu = Inches(6.5)
        for shape in doc.inline_shapes:
            self.assertLessEqual(shape.width, max_emu)
            ratio = shape.width / shape.height
            # 160x100 sample screenshots (1.6:1) and logo (160x100) must preserve aspect ratio
            self.assertAlmostEqual(ratio, 1.6, delta=0.05)

    def test_generated_docx_uses_exact_ui_labels(self):
        _, doc = self._build_temp_doc()
        full_text = _extract_all_text(doc)
        for label in [
            "Forgot your password?",
            "Menunggu Persetujuan",
            "Revisi",
            "Diterima",
            "Ditolak",
            "Tampil di Beranda",
            "Kegiatan Belajar",
            "Seni & Kreativitas",
            "Acara Khusus",
            "Acara Sepanjang Hari",
            "Libur Umum",
            "Kegiatan Sekolah",
            "Libur Semester",
            "Internasional",
            "Internal Madrasah",
            "Balas Pesan Cepat",
            "Sudah Dibaca",
            "Dibalas",
            "Tandai Semua Dibaca",
        ]:
            self.assertIn(label, full_text, f"Expected exact UI label {label!r}")
        for stale in ["Pending -> Diproses", "kegiatan/fasilitas/prestasi", "Warna label", "Ujian/Libur/Agenda Sekolah", "Keluar (Logout)"]:
            self.assertNotIn(stale, full_text, f"Stale UI label found: {stale!r}")


if __name__ == "__main__":
    unittest.main()
