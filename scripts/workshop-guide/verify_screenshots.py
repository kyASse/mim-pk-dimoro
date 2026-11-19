from __future__ import annotations

import json
import sys
import urllib.parse
from pathlib import Path

MIN_PNG_BYTES = 10_000

REQUIRED_KEYS = [
    "pub_beranda",
    "pub_pendaftaran",
    "pub_berita",
    "pub_galeri",
    "pub_kontak",
    "pub_struktur",
    "auth_login",
    "adm_dashboard",
    "adm_pendaftar_list",
    "adm_pendaftar_detail",
    "adm_siswa",
    "adm_biaya",
    "adm_berita_list",
    "adm_berita_tambah",
    "adm_ruang_perspektif",
    "adm_galeri",
    "adm_testimoni",
    "adm_kalender",
    "adm_prestasi",
    "adm_pesan",
    "adm_konten",
    "adm_kontak",
    "dev_erapor",
    "dev_portal_wali",
]


def validate_manifest(manifest_path: Path, screenshots_dir: Path) -> list[str]:
    """Verify every required screenshot exists, is >= MIN_PNG_BYTES, and did not redirect to login."""
    if not manifest_path.exists():
        return [f"Manifest not found: {manifest_path}"]

    entries = json.loads(manifest_path.read_text(encoding="utf-8"))
    by_key = {entry["key"]: entry for entry in entries}
    errors: list[str] = []

    for key in REQUIRED_KEYS:
        entry = by_key.get(key)
        if not entry:
            errors.append(f"Missing manifest entry for {key}")
            continue
        png_path = screenshots_dir / entry["file"]
        if not png_path.exists():
            errors.append(f"Missing PNG file for {key}: {png_path}")
            continue
        size = png_path.stat().st_size
        if size < MIN_PNG_BYTES:
            errors.append(f"Screenshot for {key} too small ({size} bytes < {MIN_PNG_BYTES})")
        final_url = entry.get("finalUrl", "")
        if entry.get("requiresAuth") and "/auth/login" in final_url:
            errors.append(f"Authenticated route for {key} redirected to /auth/login ({final_url})")
        expected_route = entry.get("route", "")
        actual_path = urllib.parse.urlparse(final_url).path.rstrip("/") or "/"
        norm_expected = expected_route.rstrip("/") or "/"
        if expected_route and actual_path != norm_expected:
            errors.append(f"Route mismatch for {key}: expected {norm_expected!r}, got {actual_path!r} ({final_url})")

    return errors


def main() -> int:
    screenshots_dir = Path("docs/panduan-workshop/screenshots")
    manifest_path = screenshots_dir / "manifest.json"
    errors = validate_manifest(manifest_path, screenshots_dir)
    if errors:
        for err in errors:
            print(f"ERROR: {err}", file=sys.stderr)
        return 1
    print(f"Verified {len(REQUIRED_KEYS)} screenshots cleanly.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
