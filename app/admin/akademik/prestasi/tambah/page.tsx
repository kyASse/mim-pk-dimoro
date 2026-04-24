'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TambahPrestasiPage() {
    const [form, setForm] = useState({
        nama_siswa: "",
        nama_prestasi: "",
        tingkat: "",
        tahun: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let dokumentasi_url = null;
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `prestasi-${Date.now()}.${fileExt}`;
            const { data: _upload, error } = await supabase
                .storage
                .from('dokumentasi-prestasi')
                .upload(fileName, file);

            if (error) {
                alert("Gagal upload file: " + error.message);
                setLoading(false);
                return;
            }
            const { data: publicUrlData } = supabase
                .storage
                .from('dokumentasi-prestasi')
                .getPublicUrl(fileName);
            dokumentasi_url = publicUrlData.publicUrl;
        }

        const { error } = await supabase
            .from('prestasi')
            .insert([{
                nama_siswa: form.nama_siswa,
                nama_prestasi: form.nama_prestasi,
                tingkat: form.tingkat,
                tahun: form.tahun,
                dokumentasi_url,
            }]);

        setLoading(false);

        if (error) {
            alert("Gagal menyimpan data: " + error.message);
        } else {
            router.push("/admin/akademik");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-xl bg-white rounded-xl shadow p-8 mt-8">
                <h1 className="text-3xl font-bold text-center mb-8">Form Tambah Prestasi</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium">Nama Siswa</label>
                        <input
                            type="text"
                            name="nama_siswa"
                            value={form.nama_siswa}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Prestasi</label>
                        <input
                            type="text"
                            name="nama_prestasi"
                            value={form.nama_prestasi}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Tingkat</label>
                        <input
                            type="text"
                            name="tingkat"
                            value={form.tingkat}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Tahun</label>
                        <input
                            type="number"
                            name="tahun"
                            value={form.tahun}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Unggah Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-400 hover:bg-green-500 text-white px-8 py-2 rounded transition-colors"
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                        <Link href="/admin/akademik">
                            <button
                                type="button"
                                className="bg-red-400 hover:bg-red-500 text-white px-8 py-2 rounded transition-colors"
                            >
                                Batal
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}