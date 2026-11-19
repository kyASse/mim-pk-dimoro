from __future__ import annotations

import argparse
from pathlib import Path

import pythoncom
import win32com.client


def export_docx_to_pdf(docx_path: Path, pdf_path: Path) -> dict[str, int | str]:
    """Convert a .docx file to .pdf via Microsoft Word COM automation."""
    docx_abs = docx_path.resolve()
    pdf_abs = pdf_path.resolve()
    if not docx_abs.exists():
        raise FileNotFoundError(f"DOCX file not found: {docx_abs}")

    pdf_abs.parent.mkdir(parents=True, exist_ok=True)
    pythoncom.CoInitialize()
    word = None
    doc = None
    try:
        word = win32com.client.DispatchEx("Word.Application")
        word.Visible = False
        word.DisplayAlerts = 0

        doc = word.Documents.Open(str(docx_abs), ReadOnly=True)
        doc.Fields.Update()
        pages = int(doc.ComputeStatistics(2))  # wdStatisticPages = 2
        doc.ExportAsFixedFormat(
            OutputFileName=str(pdf_abs),
            ExportFormat=17,  # wdExportFormatPDF = 17
            OpenAfterExport=False,
            OptimizeFor=0,  # wdExportOptimizeForPrint = 0
        )
        return {
            "pdf_path": str(pdf_abs),
            "pages": pages,
            "bytes": pdf_abs.stat().st_size,
        }
    finally:
        if doc is not None:
            doc.Close(SaveChanges=False)
        if word is not None:
            word.Quit()
        pythoncom.CoUninitialize()


def main() -> int:
    parser = argparse.ArgumentParser(description="Export workshop handbook DOCX to PDF via MS Word.")
    parser.add_argument(
        "--docx",
        type=Path,
        default=Path("docs/panduan-workshop/Panduan_Pengelolaan_Website_MIM_Dimoro.docx"),
    )
    parser.add_argument(
        "--pdf",
        type=Path,
        default=Path("docs/panduan-workshop/Panduan_Pengelolaan_Website_MIM_Dimoro.pdf"),
    )
    args = parser.parse_args()
    result = export_docx_to_pdf(args.docx, args.pdf)
    print(f"Exported PDF: {result['pdf_path']} ({result['pages']} pages, {result['bytes']} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
