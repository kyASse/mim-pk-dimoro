'use client';

import { useState } from "react";
import { updatePendaftarData } from "../../actions";
import { useRouter } from "next/navigation";

const kebutuhanKhususOptions = [
    { id: "gangguan_penglihatan", label: "Gangguan Penglihatan" },
    { id: "gangguan_pendengaran", label: "Gangguan Pendengaran" },
    { id: "gangguan_komunikasi", label: "Gangguan Komunikasi / Wicara" },
    { id: "autisme", label: "Spektrum Autisme (ASD)" },
    { id: "adhd", label: "ADHD (Attention Deficit Hyperactivity Disorder)" },
    { id: "kesulitan_belajar", label: "Kesulitan Belajar Spesifik" },
    { id: "hambatan_fisik", label: "Hambatan Fisik / Motorik" },
    { id: "lainnya", label: "Lainnya" },
];

export default function EditPendaftarButton({ pendaftar }: { pendaftar: any }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        ...pendaftar,
        jenis_kebutuhan_khusus: Array.isArray(pendaftar.jenis_kebutuhan_khusus)
            ? pendaftar.jenis_kebutuhan_khusus
            : (pendaftar.jenis_kebutuhan_khusus ? JSON.parse(pendaftar.jenis_kebutuhan_khusus) : []),
    });
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Untuk kebutuhan khusus (checkbox group)
    const handleKebutuhanKhusus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let updated = [...(form.jenis_kebutuhan_khusus || [])];
        if (checked) {
            updated.push(value);
        } else {
            updated = updated.filter((v: string) => v !== value);
        }
        setForm({ ...form, jenis_kebutuhan_khusus: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Pastikan kebutuhan khusus dikirim sebagai stringified JSON jika perlu
        const dataToSend = {
            ...form,
            jenis_kebutuhan_khusus: JSON.stringify(form.jenis_kebutuhan_khusus || []),
        };
        const result = await updatePendaftarData(pendaftar.id, dataToSend);
        setIsSaving(false);
        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            alert(result.message || "Gagal update data");
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold mb-4"
            >
                ✏️ Edit Data Lengkap
            </button>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] overflow-y-auto max-h-[90vh]"
                    >
                        <h2 className="font-bold text-lg mb-4">Edit Data Pendaftar</h2>
                        {/* --- DATA SISWA --- */}
                        <div className="mb-3"><b>Data Siswa</b></div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Nama Lengkap</label>
                            <input type="text" name="nama_lengkap" value={form.nama_lengkap || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Nama Panggilan</label>
                            <input type="text" name="nama_panggilan" value={form.nama_panggilan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Jenis Kelamin</label>
                            <select name="jenis_kelamin" value={form.jenis_kelamin || ""} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Tempat Lahir</label>
                            <input type="text" name="tempat_lahir" value={form.tempat_lahir || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Tanggal Lahir</label>
                            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir ? form.tanggal_lahir.slice(0, 10) : ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Agama</label>
                            <input type="text" name="agama" value={form.agama || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Kewarganegaraan</label>
                            <input type="text" name="kewarganegaraan" value={form.kewarganegaraan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Anak ke</label>
                            <input type="number" name="anak_ke" value={form.anak_ke || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" min={1} />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Jumlah Saudara Kandung</label>
                            <input type="number" name="jumlah_saudara_kandung" value={form.jumlah_saudara_kandung || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Status Anak</label>
                            <input type="text" name="status_anak" value={form.status_anak || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Bahasa Sehari-hari</label>
                            <input type="text" name="bahasa_sehari_hari" value={form.bahasa_sehari_hari || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Berat Badan (Kg)</label>
                            <input type="number" name="berat_badan" value={form.berat_badan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Tinggi Badan (Cm)</label>
                            <input type="number" name="tinggi_badan" value={form.tinggi_badan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Golongan Darah</label>
                            <input type="text" name="golongan_darah" value={form.golongan_darah || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Cita-cita</label>
                            <input type="text" name="cita_cita" value={form.cita_cita || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Alamat Tempat Tinggal</label>
                            <input type="text" name="alamat_lengkap" value={form.alamat_lengkap || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Nomor Telepon/HP</label>
                            <input type="text" name="nomor_telepon" value={form.nomor_telepon || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Jarak Tempat Tinggal (km)</label>
                            <input type="number" name="jarak_tempat_tinggal" value={form.jarak_tempat_tinggal || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
                        </div>
                        {/* --- DATA ORANG TUA --- */}
                        <div className="mb-3 mt-6"><b>Data Orang Tua</b></div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Nama Ayah Kandung</label>
                            <input type="text" name="nama_ayah_kandung" value={form.nama_ayah_kandung || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Pendidikan Ayah</label>
                            <input type="text" name="pendidikan_ayah" value={form.pendidikan_ayah || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Pekerjaan Ayah</label>
                            <input type="text" name="pekerjaan_ayah" value={form.pekerjaan_ayah || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Nama Ibu Kandung</label>
                            <input type="text" name="nama_ibu_kandung" value={form.nama_ibu_kandung || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Pendidikan Ibu</label>
                            <input type="text" name="pendidikan_ibu" value={form.pendidikan_ibu || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Pekerjaan Ibu</label>
                            <input type="text" name="pekerjaan_ibu" value={form.pekerjaan_ibu || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Email Kontak Utama</label>
                            <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        {/* --- DATA WALI (JIKA ADA) --- */}
                        <div className="mb-3 mt-6"><b>Data Wali (Opsional)</b></div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Nama Wali</label>
                            <input type="text" name="wali_nama" value={form.wali_nama || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Pendidikan Wali</label>
                            <input type="text" name="wali_pendidikan" value={form.wali_pendidikan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Hubungan dengan Keluarga</label>
                            <input type="text" name="wali_hubungan" value={form.wali_hubungan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Pekerjaan Wali</label>
                            <input type="text" name="wali_pekerjaan" value={form.wali_pekerjaan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        {/* --- KEBUTUHAN KHUSUS (JIKA ADA) --- */}
                        <div className="mb-3 mt-6"><b>Kebutuhan Khusus (Opsional)</b></div>
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Memiliki Kebutuhan Khusus?</label>
                            <select name="memiliki_kebutuhan_khusus" value={form.memiliki_kebutuhan_khusus ? "true" : "false"} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="false">Tidak</option>
                                <option value="true">Ya</option>
                            </select>
                        </div>
                        {form.memiliki_kebutuhan_khusus === true || form.memiliki_kebutuhan_khusus === "true" ? (
                            <>
                                <div className="mb-3">
                                    <label className="block font-medium mb-1">Jenis Kebutuhan Khusus</label>
                                    <div className="flex flex-wrap gap-3">
                                        {kebutuhanKhususOptions.map(opt => (
                                            <label key={opt.id} className="flex items-center gap-1">
                                                <input
                                                    type="checkbox"
                                                    value={opt.id}
                                                    checked={form.jenis_kebutuhan_khusus?.includes(opt.id)}
                                                    onChange={handleKebutuhanKhusus}
                                                />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block font-medium mb-1">Deskripsi Kebutuhan Khusus</label>
                                    <textarea
                                        name="deskripsi_kebutuhan_khusus"
                                        value={form.deskripsi_kebutuhan_khusus || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </>
                        ) : null}
                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="bg-gray-200 px-4 py-2 rounded"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                            >
                                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}