import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent))

from seed_capture_data import (
    DEMO_TAG,
    DEMO_SLUG_PREFIX,
    build_demo_payloads,
    cleanup_demo_data,
    load_env,
)


class TestSeedCaptureData(unittest.TestCase):
    def test_load_env_reads_local_supabase(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            env_file = Path(tmpdir) / ".env.local"
            env_file.write_text(
                "NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\n"
                "SUPABASE_SERVICE_ROLE_KEY=demo-service-key\n",
                encoding="utf-8",
            )
            env = load_env(env_file)
            self.assertEqual(env["NEXT_PUBLIC_SUPABASE_URL"], "http://127.0.0.1:54321")
            self.assertEqual(env["SUPABASE_SERVICE_ROLE_KEY"], "demo-service-key")

    def test_load_env_rejects_non_local_url(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            env_file = Path(tmpdir) / ".env.local"
            env_file.write_text(
                "NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co\n"
                "SUPABASE_SERVICE_ROLE_KEY=remote-key\n",
                encoding="utf-8",
            )
            with self.assertRaises(ValueError):
                load_env(env_file)

    def test_build_demo_payloads_matches_table_columns(self):
        payloads = build_demo_payloads()
        self.assertEqual(
            set(payloads.keys()),
            {"kalender_akademik", "prestasi", "pesan_masuk", "opini_perspektif"},
        )
        for table, rows in payloads.items():
            self.assertGreaterEqual(len(rows), 2, f"{table} should have >= 2 sample rows")

        for row in payloads["kalender_akademik"]:
            self.assertNotIn(DEMO_TAG, row["judul"])
            self.assertIn(DEMO_TAG, row["deskripsi"])
            self.assertIn(row["kategori"], {"Kegiatan Sekolah", "Penerimaan LHB", "Libur Semester"})
            self.assertTrue({"judul", "tanggal", "kategori", "deskripsi", "warna"}.issubset(row.keys()))

        for row in payloads["prestasi"]:
            self.assertNotIn(DEMO_TAG, row["nama_prestasi"])
            self.assertIn(DEMO_TAG, row["deskripsi"])
            self.assertTrue({"tahun", "nama_prestasi", "tingkat", "nama_siswa", "deskripsi"}.issubset(row.keys()))

        for row in payloads["pesan_masuk"]:
            self.assertNotIn(DEMO_TAG, row["subjek"])
            self.assertTrue(row["email_pengirim"].endswith("@demo-capture.local"))
            self.assertIn(row["status"], {"belum_dibaca", "dibaca", "dibalas"})
            self.assertTrue(
                {"nama_pengirim", "email_pengirim", "telepon", "subjek", "isi_pesan", "status"}.issubset(row.keys())
            )

        for row in payloads["opini_perspektif"]:
            self.assertTrue(row["slug"].startswith(DEMO_SLUG_PREFIX))
            self.assertNotIn(DEMO_TAG, row["judul"])
            self.assertTrue(
                {
                    "slug",
                    "judul",
                    "ringkasan",
                    "isi_lengkap",
                    "kategori",
                    "nama_penulis",
                    "peran_penulis",
                    "kontak_wa",
                    "status",
                }.issubset(row.keys())
            )

    def test_cleanup_demo_data_targets_tagged_columns(self):
        calls: list[tuple[str, str]] = []

        def fake_request(url: str, method: str, service_key: str, body=None):
            calls.append((method, url))
            return 200, "[]"

        with patch("seed_capture_data._request", side_effect=fake_request):
            cleanup_demo_data("http://127.0.0.1:54321", "key")

        urls = dict((url.split("/rest/v1/")[1].split("?")[0], url.split("?")[1]) for _, url in calls)
        self.assertTrue(all(m == "DELETE" for m, _ in calls))
        self.assertIn("deskripsi=like.", urls["kalender_akademik"])
        self.assertIn("deskripsi=like.", urls["prestasi"])
        self.assertIn("email_pengirim=like.", urls["pesan_masuk"])
        self.assertIn("slug=like.demo-capture-", urls["opini_perspektif"])


if __name__ == "__main__":
    unittest.main()
