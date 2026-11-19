import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from verify_screenshots import REQUIRED_KEYS, validate_manifest


class TestVerifyScreenshots(unittest.TestCase):
    def _write_valid_manifest(self, tmp: Path, overrides: dict[str, dict] | None = None) -> Path:
        overrides = overrides or {}
        entries = []
        for key in REQUIRED_KEYS:
            filename = f"{key}.png"
            png_path = tmp / filename
            png_path.write_bytes(b"\x89PNG\r\n\x1a\n" + (b"0" * 16000))
            entry = {
                "key": key,
                "route": f"/{key}",
                "file": filename,
                "finalUrl": f"http://localhost:3000/{key}",
                "width": 1440,
                "height": 900,
                "bytes": png_path.stat().st_size,
                "requiresAuth": key.startswith("adm_") or key.startswith("dev_"),
            }
            if key in overrides:
                entry.update(overrides[key])
            entries.append(entry)
        manifest_path = tmp / "manifest.json"
        manifest_path.write_text(json.dumps(entries), encoding="utf-8")
        return manifest_path

    def test_validate_manifest_flags_auth_redirect(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            manifest = self._write_valid_manifest(
                tmp,
                {"adm_dashboard": {"finalUrl": "http://localhost:3000/auth/login"}},
            )
            errors = validate_manifest(manifest, tmp)
            self.assertTrue(any("adm_dashboard" in err and "/auth/login" in err for err in errors))

    def test_validate_manifest_flags_missing_or_tiny_png(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            manifest = self._write_valid_manifest(tmp, {"pub_beranda": {"bytes": 500}})
            (tmp / "pub_beranda.png").write_bytes(b"tiny")
            (tmp / "auth_login.png").unlink()
            errors = validate_manifest(manifest, tmp)
            self.assertTrue(any("pub_beranda" in err for err in errors))
            self.assertTrue(any("auth_login" in err for err in errors))

    def test_validate_manifest_passes_valid_entries(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            manifest = self._write_valid_manifest(tmp)
            errors = validate_manifest(manifest, tmp)
            self.assertEqual(errors, [])


if __name__ == "__main__":
    unittest.main()
