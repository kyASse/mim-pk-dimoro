import sys
import tempfile
import unittest
from pathlib import Path

from docx import Document

sys.path.insert(0, str(Path(__file__).resolve().parent))

from export_pdf import export_docx_to_pdf


class TestExportPdf(unittest.TestCase):
    def test_export_raises_on_missing_docx(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            with self.assertRaises(FileNotFoundError):
                export_docx_to_pdf(tmp / "missing.docx", tmp / "out.pdf")

    def test_export_converts_minimal_docx_to_valid_pdf(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            docx_path = tmp / "sample.docx"
            pdf_path = tmp / "sample.pdf"
            doc = Document()
            doc.add_heading("Uji Ekspor PDF", level=1)
            doc.add_paragraph("Dokumen contoh untuk verifikasi Word COM PDF export.")
            doc.save(str(docx_path))

            result = export_docx_to_pdf(docx_path, pdf_path)
            self.assertTrue(pdf_path.exists())
            self.assertGreaterEqual(result["pages"], 1)
            self.assertGreater(result["bytes"], 5000)
            self.assertTrue(pdf_path.read_bytes().startswith(b"%PDF-"))


if __name__ == "__main__":
    unittest.main()
