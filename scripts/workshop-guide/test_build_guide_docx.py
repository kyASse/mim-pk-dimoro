import base64
import sys
import tempfile
import unittest
from pathlib import Path

from docx import Document
from docx.shared import Inches

sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_guide_docx import generate_guide_docx
from verify_screenshots import REQUIRED_KEYS

# Minimal 1x1 PNG bytes for isolated unit tests
SAMPLE_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
)


def _extract_all_text(doc: Document) -> str:
    parts: list[str] = [p.text for p in doc.paragraphs]
    for table in doc.tables:
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


if __name__ == "__main__":
    unittest.main()
