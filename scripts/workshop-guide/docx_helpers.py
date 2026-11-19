from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from docx.shared import Inches, Mm, Pt, RGBColor

EMERALD_HEX = "0F766E"
ACCENT_HEX = "059669"
SLATE_HEX = "1E293B"
MUTED_HEX = "475569"
BORDER_HEX = "CBD5E1"
ROW_ALT_HEX = "F8FAFC"

EMERALD = RGBColor(0x0F, 0x76, 0x6E)
ACCENT = RGBColor(0x05, 0x96, 0x69)
SLATE = RGBColor(0x1E, 0x29, 0x3B)
MUTED = RGBColor(0x47, 0x55, 0x69)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)


def configure_a4_document(doc: Document) -> None:
    """Set A4 page geometry, margins, base Normal style, and running header/footer."""
    section = doc.sections[0]
    section.page_width = Mm(210)
    section.page_height = Mm(297)
    section.top_margin = Mm(18)
    section.bottom_margin = Mm(18)
    section.left_margin = Mm(20)
    section.right_margin = Mm(20)
    section.different_first_page_header_footer = True

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = SLATE
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.2

    _configure_header_footer(section)


def _add_field(run, field_name: str) -> None:
    fld_begin = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
    instr = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> {field_name} </w:instrText>')
    fld_sep = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>')
    fld_end = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
    run._r.append(fld_begin)
    run._r.append(instr)
    run._r.append(fld_sep)
    run._r.append(fld_end)


def _configure_header_footer(section) -> None:
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hrun = hp.add_run("Buku Panduan Pengelolaan Website Resmi — MI Muhammadiyah PK Dimoro")
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = MUTED
    _set_paragraph_bottom_border(hp, BORDER_HEX, sz="4")

    footer = section.footer
    ftbl = footer.add_table(rows=1, cols=2, width=Inches(6.69))
    ftbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    _clear_table_borders(ftbl)

    left_p = ftbl.cell(0, 0).paragraphs[0]
    left_p.paragraph_format.space_after = Pt(0)
    lrun = left_p.add_run("Panduan Operator Workshop | https://mimpkdimoro.sch.id")
    lrun.font.size = Pt(8.5)
    lrun.font.color.rgb = MUTED

    right_p = ftbl.cell(0, 1).paragraphs[0]
    right_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    right_p.paragraph_format.space_after = Pt(0)
    r1 = right_p.add_run("Halaman ")
    r1.font.size = Pt(8.5)
    r1.font.color.rgb = MUTED
    r_page = right_p.add_run()
    r_page.font.size = Pt(8.5)
    r_page.font.color.rgb = MUTED
    _add_field(r_page, "PAGE")
    r2 = right_p.add_run(" dari ")
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = MUTED
    r_num = right_p.add_run()
    r_num.font.size = Pt(8.5)
    r_num.font.color.rgb = MUTED
    _add_field(r_num, "NUMPAGES")


def _set_cell_shading(cell, fill_hex: str) -> None:
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)


def _set_cell_margins(cell, top: int = 100, bottom: int = 100, left: int = 140, right: int = 140) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = OxmlElement("w:tcMar")
    for side, val in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        node = OxmlElement(f"w:{side}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        tc_mar.append(node)
    tc_pr.append(tc_mar)


def _set_cell_borders(cell, color: str = BORDER_HEX, sz: str = "6", sides: tuple[str, ...] = ("top", "bottom", "left", "right")) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_borders = OxmlElement("w:tcBorders")
    for side in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{side}")
        if side in sides:
            el.set(qn("w:val"), "single")
            el.set(qn("w:sz"), sz)
            el.set(qn("w:space"), "0")
            el.set(qn("w:color"), color)
        else:
            el.set(qn("w:val"), "none")
        tc_borders.append(el)
    tc_pr.append(tc_borders)


def _clear_table_borders(table) -> None:
    for row in table.rows:
        for cell in row.cells:
            _set_cell_borders(cell, sides=())


def _set_paragraph_bottom_border(paragraph, color: str, sz: str = "6") -> None:
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), sz)
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), color)
    p_bdr.append(bottom)
    p_pr.append(p_bdr)


def _prevent_row_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tr_pr.append(OxmlElement("w:cantSplit"))


def add_chapter_banner(doc: Document, chapter_label: str, title: str, summary: str) -> None:
    """Insert a visually distinct chapter banner with page-break awareness."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.69)
    _set_cell_shading(cell, EMERALD_HEX)
    _set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    _set_cell_borders(cell, color=EMERALD_HEX, sz="4")
    _prevent_row_split(tbl.rows[0])

    p1 = cell.paragraphs[0]
    p1.paragraph_format.space_after = Pt(2)
    r_lbl = p1.add_run(chapter_label.upper())
    r_lbl.font.size = Pt(9)
    r_lbl.font.bold = True
    r_lbl.font.color.rgb = RGBColor(0xA7, 0xF3, 0xD0)

    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(3)
    r_title = p2.add_run(title)
    r_title.font.size = Pt(15)
    r_title.font.bold = True
    r_title.font.color.rgb = WHITE

    p3 = cell.add_paragraph()
    p3.paragraph_format.space_after = Pt(0)
    r_sum = p3.add_run(summary)
    r_sum.font.size = Pt(9.5)
    r_sum.font.color.rgb = RGBColor(0xEC, 0xFD, 0xF5)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(4)


def add_section_heading(doc: Document, title: str, subtitle: str | None = None) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(title)
    run.font.size = Pt(12.5)
    run.font.bold = True
    run.font.color.rgb = EMERALD
    _set_paragraph_bottom_border(p, "D1FAE5", sz="6")

    if subtitle:
        ps = doc.add_paragraph()
        ps.paragraph_format.space_after = Pt(4)
        ps.paragraph_format.keep_with_next = True
        rs = ps.add_run(subtitle)
        rs.font.size = Pt(9.5)
        rs.font.italic = True
        rs.font.color.rgb = MUTED


def add_body(doc: Document, text: str, bold_prefix: str | None = None) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    if bold_prefix:
        rb = p.add_run(bold_prefix)
        rb.bold = True
        rb.font.color.rgb = SLATE
    p.add_run(text)


def add_steps_list(doc: Document, steps: list[tuple[str, str]]) -> None:
    """Render numbered step-by-step operator instructions."""
    for idx, (action, detail) in enumerate(steps, start=1):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.22)
        p.paragraph_format.first_line_indent = Inches(-0.22)
        p.paragraph_format.space_after = Pt(3.5)
        r_num = p.add_run(f"{idx}. ")
        r_num.bold = True
        r_num.font.color.rgb = ACCENT
        r_act = p.add_run(action + " ")
        r_act.bold = True
        r_act.font.color.rgb = SLATE
        r_det = p.add_run(detail)
        r_det.font.color.rgb = SLATE


def add_callout_box(doc: Document, kind: str, title: str, lines: list[str]) -> None:
    """Render an Info, Tips, or Peringatan callout box."""
    palettes = {
        "info": ("EFF6FF", "2563EB", RGBColor(0x1E, 0x40, 0xAF)),
        "tips": ("ECFDF5", "059669", RGBColor(0x06, 0x5F, 0x46)),
        "warning": ("FFFBEB", "D97706", RGBColor(0x92, 0x40, 0x0E)),
        "danger": ("FEF2F2", "DC2626", RGBColor(0x99, 0x1B, 0x1B)),
    }
    fill_hex, border_hex, title_rgb = palettes.get(kind, palettes["info"])

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.69)
    _set_cell_shading(cell, fill_hex)
    _set_cell_margins(cell, top=100, bottom=100, left=160, right=140)
    _set_cell_borders(cell, color=border_hex, sz="24", sides=("left",))
    _prevent_row_split(tbl.rows[0])

    p0 = cell.paragraphs[0]
    p0.paragraph_format.space_after = Pt(3)
    rt = p0.add_run(title)
    rt.bold = True
    rt.font.size = Pt(10)
    rt.font.color.rgb = title_rgb

    for idx, line in enumerate(lines):
        p = cell.add_paragraph()
        p.paragraph_format.space_after = Pt(2 if idx < len(lines) - 1 else 0)
        r = p.add_run(f"• {line}" if len(lines) > 1 else line)
        r.font.size = Pt(9.5)
        r.font.color.rgb = SLATE

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(3)


def add_styled_table(
    doc: Document,
    headers: list[str],
    rows: list[list[str]],
    col_widths: list[float] | None = None,
) -> None:
    tbl = doc.add_table(rows=1 + len(rows), cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    hdr_row = tbl.rows[0]
    _prevent_row_split(hdr_row)
    tr_pr = hdr_row._tr.get_or_add_trPr()
    tr_pr.append(OxmlElement("w:tblHeader"))

    for col_idx, text in enumerate(headers):
        cell = hdr_row.cells[col_idx]
        if col_widths:
            cell.width = Inches(col_widths[col_idx])
        _set_cell_shading(cell, EMERALD_HEX)
        _set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        _set_cell_borders(cell, color=EMERALD_HEX, sz="4")
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = WHITE

    for r_idx, row_vals in enumerate(rows):
        row = tbl.rows[r_idx + 1]
        _prevent_row_split(row)
        fill = ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate(row_vals):
            cell = row.cells[col_idx]
            if col_widths:
                cell.width = Inches(col_widths[col_idx])
            _set_cell_shading(cell, fill)
            _set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            _set_cell_borders(cell, color=BORDER_HEX, sz="4")
            cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            r.font.color.rgb = SLATE

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(4)


def add_screenshot_figure(
    doc: Document,
    image_path: Path,
    caption: str,
    width_inches: float = 6.1,
) -> None:
    """Embed a screenshot inside a bordered frame with caption kept together on one page."""
    if not image_path.exists():
        raise FileNotFoundError(f"Missing screenshot image: {image_path}")

    safe_width = min(width_inches, 6.2)
    tbl = doc.add_table(rows=2, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    img_row, cap_row = tbl.rows[0], tbl.rows[1]
    _prevent_row_split(img_row)
    _prevent_row_split(cap_row)

    c_img = img_row.cells[0]
    c_img.width = Inches(6.5)
    _set_cell_shading(c_img, "FFFFFF")
    _set_cell_margins(c_img, top=80, bottom=60, left=80, right=80)
    _set_cell_borders(c_img, color=BORDER_HEX, sz="6", sides=("top", "left", "right"))
    p_img = c_img.paragraphs[0]
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_after = Pt(0)
    p_img.paragraph_format.keep_with_next = True
    p_img.add_run().add_picture(str(image_path), width=Inches(safe_width))

    c_cap = cap_row.cells[0]
    c_cap.width = Inches(6.5)
    _set_cell_shading(c_cap, ROW_ALT_HEX)
    _set_cell_margins(c_cap, top=60, bottom=60, left=100, right=100)
    _set_cell_borders(c_cap, color=BORDER_HEX, sz="6", sides=("bottom", "left", "right"))
    p_cap = c_cap.paragraphs[0]
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(0)
    rc = p_cap.add_run(caption)
    rc.font.size = Pt(8.5)
    rc.font.italic = True
    rc.font.color.rgb = MUTED

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(4)
