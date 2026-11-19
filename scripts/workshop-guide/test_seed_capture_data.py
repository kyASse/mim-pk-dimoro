import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from seed_capture_data import (
    DEMO_TAG,
    DEMO_SLUG_PREFIX,
    build_demo_payloads,
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
            self.assertIn(DEMO_TAG, row["judul"])
            self.assertTrue({"judul", "tanggal", "kategori", "deskripsi", "warna"}.issubset(row.keys()))

        for row in payloads["prestasi"]:
            self.assertIn(DEMO_TAG, row["nama_prestasi"])
            self.assertTrue({"tahun", "nama_prestasi", "tingkat", "nama_siswa", "deskripsi"}.issubset(row.keys()))

        for row in payloads["pesan_masuk"]:
            self.assertIn(DEMO_TAG, row["subjek"])
            self.assertTrue(
                {"nama_pengirim", "email_pengirim", "telepon", "subjek", "isi_pesan", "status"}.issubset(row.keys())
            )

        for row in payloads["opini_perspektif"]:
            self.assertTrue(row["slug"].startswith(DEMO_SLUG_PREFIX))
            self.assertIn(DEMO_TAG, row["judul"])
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


if __name__ == "__main__":
    unittest.main()
