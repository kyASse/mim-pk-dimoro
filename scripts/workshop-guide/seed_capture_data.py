from __future__ import annotations

import argparse
import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

DEMO_TAG = "[DEMO-CAPTURE]"
DEMO_SLUG_PREFIX = "demo-capture-"


def _ensure_local_url(url: str) -> None:
    parsed = urllib.parse.urlparse(url.strip())
    if parsed.scheme not in ("http", "https") or parsed.hostname not in ("127.0.0.1", "localhost"):
        raise ValueError(f"Refusing non-local Supabase URL: {url!r}")


def load_env(env_path: Path) -> dict[str, str]:
    """Read required local Supabase env vars and reject non-local URLs."""
    values: dict[str, str] = {}
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        values[key.strip()] = val.strip().strip('"').strip("'")

    base_url = values.get("NEXT_PUBLIC_SUPABASE_URL", "")
    service_key = values.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not base_url or not service_key:
        raise ValueError("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    _ensure_local_url(base_url)
    return values


def build_demo_payloads() -> dict[str, list[dict]]:
    """Return realistic Indonesian sample rows tagged with DEMO_TAG for screenshot capture."""
    return {
        "kalender_akademik": [
            {
                "judul": f"{DEMO_TAG} Penilaian Akhir Semester (PAS) Ganjil",
                "tanggal": "2026-12-07",
                "tanggal_berakhir": "2026-12-12",
                "waktu": "07.30 - 11.30 WIB",
                "kategori": "Ujian",
                "deskripsi": "Pelaksanaan Penilaian Akhir Semester Ganjil seluruh kelas 1 s.d. 6.",
                "warna": "#059669",
            },
            {
                "judul": f"{DEMO_TAG} Pembagian Rapor & Pertemuan Wali Murid",
                "tanggal": "2026-12-19",
                "tanggal_berakhir": "2026-12-19",
                "waktu": "08.00 - 11.00 WIB",
                "kategori": "Agenda Sekolah",
                "deskripsi": "Penyerahan laporan hasil belajar siswa semester ganjil di ruang kelas masing-masing.",
                "warna": "#2563eb",
            },
        ],
        "prestasi": [
            {
                "tahun": 2026,
                "nama_prestasi": f"{DEMO_TAG} Juara 1 Musabaqah Hifdzil Qur'an Juz 30",
                "tingkat": "Kabupaten",
                "nama_siswa": "Ahmad Fauzan Ramadhan",
                "deskripsi": "Meraih peringkat pertama cabang MHQ Juz 30 tingkat Kabupaten Sukoharjo.",
            },
            {
                "tahun": 2026,
                "nama_prestasi": f"{DEMO_TAG} Juara 2 Kejuaraan Tapak Suci Pelajar",
                "tingkat": "Provinsi",
                "nama_siswa": "Siti Aisyah Putri",
                "deskripsi": "Medali perak kategori tanding usia dini putri tingkat Jawa Tengah.",
            },
        ],
        "pesan_masuk": [
            {
                "nama_pengirim": "Bpk. Rahmat Hidayat",
                "email_pengirim": "rahmat.hidayat@example.com",
                "telepon": "081234567890",
                "subjek": f"{DEMO_TAG} Informasi Jadwal Observasi PPDB Gelombang 1",
                "isi_pesan": "Assalamu'alaikum admin, mohon info apakah observasi calon siswa kelas 1 dilaksanakan setiap hari Sabtu?",
                "status": "belum_dibaca",
            },
            {
                "nama_pengirim": "Ibu Nurul Khasanah",
                "email_pengirim": "nurul.khasanah@example.com",
                "telepon": "085612349876",
                "subjek": f"{DEMO_TAG} Pertanyaan Program Ekstrakurikuler Tahfidz",
                "isi_pesan": "Mohon informasi jadwal bimbingan tahfidz untuk siswa kelas 3 di semester genap.",
                "status": "sudah_dibaca",
            },
        ],
        "opini_perspektif": [
            {
                "slug": f"{DEMO_SLUG_PREFIX}membentuk-karakter-qurani",
                "judul": f"{DEMO_TAG} Membentuk Karakter Qurani Sejak Bangku Madrasah",
                "ringkasan": "Sinergi pembiasaan ibadah harian di madrasah dan keteladanan orang tua di rumah.",
                "isi_lengkap": "Pembinaan karakter Islami pada usia sekolah dasar membutuhkan konsistensi antara guru di madrasah dan wali murid di rumah melalui program muraja'ah dan adab harian.",
                "kategori": "Pendidikan & Karakter",
                "nama_penulis": "Ust. Muhammad Arifin",
                "peran_penulis": "guru",
                "keterangan_peran": "Guru Tahfidz MIM PK Dimoro",
                "kontak_wa": "081200001111",
                "status": "terbit",
                "is_featured": True,
            },
            {
                "slug": f"{DEMO_SLUG_PREFIX}literasi-digital-anak",
                "judul": f"{DEMO_TAG} Mendampingi Anak Berliterasi Digital Secara Sehat",
                "ringkasan": "Tips praktis wali murid mengarahkan penggunaan gawai untuk belajar kreatif.",
                "isi_lengkap": "Pendampingan belajar di era digital menuntut komunikasi aktif orang tua dan madrasah agar anak mampu memanfaatkan teknologi untuk kebaikan.",
                "kategori": "Parenting Islami",
                "nama_penulis": "Ibu Dewi Sartika",
                "peran_penulis": "wali_murid",
                "keterangan_peran": "Wali Murid Kelas 4A",
                "kontak_wa": "081200002222",
                "status": "menunggu_kurasi",
                "is_featured": False,
            },
        ],
    }


def _request(url: str, method: str, service_key: str, body: object | None = None) -> tuple[int, str]:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} on {method} {url}: {detail}") from exc


def cleanup_demo_data(base_url: str, service_key: str) -> dict[str, int]:
    """Delete only temporary DEMO_TAG / DEMO_SLUG_PREFIX rows from local Supabase."""
    _ensure_local_url(base_url)
    base = base_url.rstrip("/")
    tag_filter = urllib.parse.quote(f"*{DEMO_TAG}*")
    filters = {
        "kalender_akademik": f"judul=like.{tag_filter}",
        "prestasi": f"nama_prestasi=like.{tag_filter}",
        "pesan_masuk": f"subjek=like.{tag_filter}",
        "opini_perspektif": f"slug=like.{urllib.parse.quote(DEMO_SLUG_PREFIX + '*')}",
    }
    deleted: dict[str, int] = {}
    for table, query in filters.items():
        _, resp_text = _request(f"{base}/rest/v1/{table}?{query}", "DELETE", service_key)
        rows = json.loads(resp_text) if resp_text.strip() else []
        deleted[table] = len(rows)
    return deleted


def seed_demo_data(base_url: str, service_key: str) -> dict[str, int]:
    """Idempotently seed tagged dummy rows into the 4 unseeded tables."""
    cleanup_demo_data(base_url, service_key)
    base = base_url.rstrip("/")
    payloads = build_demo_payloads()
    inserted: dict[str, int] = {}
    for table, rows in payloads.items():
        _, resp_text = _request(f"{base}/rest/v1/{table}", "POST", service_key, rows)
        created = json.loads(resp_text) if resp_text.strip() else []
        inserted[table] = len(created)
    return inserted


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed or clean up temporary demo rows on local Supabase.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--seed", action="store_true", help="Insert temporary tagged rows")
    group.add_argument("--cleanup", action="store_true", help="Remove temporary tagged rows")
    parser.add_argument("--env-file", type=Path, default=Path(".env.local"))
    args = parser.parse_args()

    env = load_env(args.env_file)
    base_url = env["NEXT_PUBLIC_SUPABASE_URL"]
    service_key = env["SUPABASE_SERVICE_ROLE_KEY"]
    if args.seed:
        result = seed_demo_data(base_url, service_key)
        print("Seeded temporary rows:", json.dumps(result))
    else:
        result = cleanup_demo_data(base_url, service_key)
        print("Cleaned up temporary rows:", json.dumps(result))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
