'use client';

import { useState } from "react";
import { updatePendaftarData } from "../../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    Edit, 
    X, 
    Save, 
    User, 
    Users, 
    UserCheck, 
    Heart, 
    GraduationCap,
    Loader2
} from "lucide-react";

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

const transportasiOptions = [
    "Jalan Kaki",
    "Sepeda",
    "Sepeda Motor",
    "Mobil Pribadi",
    "Antar Jemput",
    "Angkutan Umum",
    "Lainnya"
];

const golonganDarahOptions = ["A", "B", "AB", "O", "Tidak Tahu"];

const gajiOptions = [
    "< Rp 1.000.000",
    "Rp 1.000.000 - Rp 3.000.000",
    "Rp 3.000.000 - Rp 5.000.000",
    "Rp 5.000.000 - Rp 10.000.000",
    "> Rp 10.000.000"
];

export default function EditPendaftarButton({ pendaftar }: { pendaftar: any }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        ...pendaftar,
        jenis_kebutuhan_khusus: Array.isArray(pendaftar.jenis_kebutuhan_khusus)
            ? pendaftar.jenis_kebutuhan_khusus
            : (pendaftar.jenis_kebutuhan_khusus ? (() => {
                try { return JSON.parse(pendaftar.jenis_kebutuhan_khusus); } catch { return []; }
            })() : []),
    });
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            setForm({ ...form, [name]: value === '' ? null : Number(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // Checkbox group for kebutuhan khusus
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
        try {
            const dataToSend = {
                ...form,
                anak_ke: form.anak_ke ? Number(form.anak_ke) : null,
                jumlah_saudara_kandung: form.jumlah_saudara_kandung !== null && form.jumlah_saudara_kandung !== '' ? Number(form.jumlah_saudara_kandung) : null,
                berat_badan: form.berat_badan ? Number(form.berat_badan) : null,
                tinggi_badan: form.tinggi_badan ? Number(form.tinggi_badan) : null,
                memiliki_kebutuhan_khusus: form.memiliki_kebutuhan_khusus === true || form.memiliki_kebutuhan_khusus === 'true',
                jenis_kebutuhan_khusus: form.memiliki_kebutuhan_khusus ? form.jenis_kebutuhan_khusus : [],
                diterima_pada_tanggal: form.diterima_pada_tanggal || null,
            };

            const result = await updatePendaftarData(pendaftar.id, dataToSend);
            setIsSaving(false);
            if (result.success) {
                setOpen(false);
                router.refresh();
            } else {
                alert(result.message || "Gagal memperbarui data.");
            }
        } catch (err: any) {
            setIsSaving(false);
            alert(err.message || "Terjadi kesalahan saat menyimpan data.");
        }
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                variant="outline"
                className="flex items-center gap-2 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 shadow-sm"
            >
                <Edit className="w-4 h-4 text-amber-600" />
                <span>Edit Data Lengkap</span>
            </Button>

            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Data Pendaftar</h2>
                                <p className="text-sm text-gray-500">Sesuaikan seluruh 27 butir data formulir pendaftaran fisik resmi.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200/60 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-6 space-y-8 flex-1">
                            {/* --- BAGIAN A: DATA SISWA --- */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-base font-semibold text-gray-900">A. Keterangan Tentang Anak (20 Poin)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">1. Nama Lengkap *</label>
                                        <input type="text" name="nama_lengkap" value={form.nama_lengkap || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Panggilan</label>
                                        <input type="text" name="nama_panggilan" value={form.nama_panggilan || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">2. Jenis Kelamin</label>
                                        <select name="jenis_kelamin" value={form.jenis_kelamin || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="">Pilih</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">3. Tempat Lahir</label>
                                            <input type="text" name="tempat_lahir" value={form.tempat_lahir || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Lahir</label>
                                            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir ? form.tanggal_lahir.slice(0, 10) : ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">4. Agama</label>
                                        <input type="text" name="agama" value={form.agama || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">5. Kewarganegaraan</label>
                                        <select name="kewarganegaraan" value={form.kewarganegaraan || "WNI"} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="WNI">WNI</option>
                                            <option value="WNA">WNA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">6. Status Anak dalam Keluarga</label>
                                        <input type="text" name="status_anak" placeholder="Anak Kandung / Tiri / Angkat" value={form.status_anak || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">7. Anak ke</label>
                                            <input type="number" name="anak_ke" value={form.anak_ke ?? ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" min={1} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">8. Jml Saudara Kandung</label>
                                            <input type="number" name="jumlah_saudara_kandung" value={form.jumlah_saudara_kandung ?? ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" min={0} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">9. Bahasa Sehari-hari</label>
                                        <input type="text" name="bahasa_sehari_hari" value={form.bahasa_sehari_hari || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">10. RA / TK Asal</label>
                                        <input type="text" name="tk_asal" placeholder="Nama RA / TK Asal" value={form.tk_asal || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">11. Cita-cita</label>
                                        <input type="text" name="cita_cita" value={form.cita_cita || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">12. Hobi / Kegemaran</label>
                                        <input type="text" name="hobi" value={form.hobi || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">13. Alamat Tempat Tinggal</label>
                                        <textarea name="alamat_lengkap" rows={2} value={form.alamat_lengkap || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">14. Nomor Telepon / HP</label>
                                        <input type="text" name="nomor_telepon" value={form.nomor_telepon || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">15. Jarak ke Sekolah (km)</label>
                                        <input type="text" name="jarak_tempat_tinggal" placeholder="Contoh: 1, 2.5, < 1" value={form.jarak_tempat_tinggal || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">16. Transportasi ke Sekolah</label>
                                        <select name="transportasi" value={form.transportasi || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="">Pilih Transportasi</option>
                                            {transportasiOptions.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">17a. Berat (Kg)</label>
                                            <input type="number" name="berat_badan" value={form.berat_badan ?? ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" min={0} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">17b. Tinggi (Cm)</label>
                                            <input type="number" name="tinggi_badan" value={form.tinggi_badan ?? ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" min={0} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">17c. Gol. Darah</label>
                                            <select name="golongan_darah" value={form.golongan_darah || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                                <option value="">Pilih</option>
                                                {golonganDarahOptions.map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- BAGIAN B: DATA ORANG TUA --- */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-green-100">
                                    <Users className="w-5 h-5 text-green-600" />
                                    <h3 className="text-base font-semibold text-gray-900">B. Data Orang Tua (Ayah & Ibu)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-semibold text-xs text-blue-700 uppercase tracking-wider">Data Ayah Kandung</h4>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">18a. Nama Ayah</label>
                                            <input type="text" name="nama_ayah_kandung" value={form.nama_ayah_kandung || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">19a. Pendidikan Ayah</label>
                                            <input type="text" name="pendidikan_ayah" value={form.pendidikan_ayah || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">20a. Pekerjaan Ayah</label>
                                            <input type="text" name="pekerjaan_ayah" value={form.pekerjaan_ayah || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-semibold text-xs text-pink-700 uppercase tracking-wider">Data Ibu Kandung</h4>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">18b. Nama Ibu</label>
                                            <input type="text" name="nama_ibu_kandung" value={form.nama_ibu_kandung || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">19b. Pendidikan Ibu</label>
                                            <input type="text" name="pendidikan_ibu" value={form.pendidikan_ibu || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">20b. Pekerjaan Ibu</label>
                                            <input type="text" name="pekerjaan_ibu" value={form.pekerjaan_ibu || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">21. Alamat Domisili Orang Tua</label>
                                        <input type="text" name="alamat_orang_tua" placeholder="Alamat tinggal orang tua" value={form.alamat_orang_tua || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">22. Gaji / Penghasilan Orang Tua</label>
                                        <select name="gaji_orang_tua" value={form.gaji_orang_tua || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                                            <option value="">Pilih Rentang Gaji</option>
                                            {gajiOptions.map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">23. Email Kontak Utama</label>
                                        <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* --- BAGIAN C: DATA WALI --- */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
                                    <UserCheck className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-base font-semibold text-gray-900">C. Data Wali (Opsional)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">24. Nama Wali</label>
                                        <input type="text" name="wali_nama" value={form.wali_nama || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">25. Hubungan dengan Calon Siswa</label>
                                        <input type="text" name="wali_hubungan" placeholder="Contoh: Paman, Kakek, Nenek" value={form.wali_hubungan || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">26a. Pendidikan Wali</label>
                                        <input type="text" name="wali_pendidikan" value={form.wali_pendidikan || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">26b. Pekerjaan Wali</label>
                                        <input type="text" name="wali_pekerjaan" value={form.wali_pekerjaan || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">27a. Alamat Domisili Wali</label>
                                        <input type="text" name="wali_alamat" value={form.wali_alamat || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">27b. Nomor Telepon / HP Wali</label>
                                        <input type="text" name="wali_telepon" value={form.wali_telepon || ""} onChange={handleChange} className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* --- BAGIAN D: KEBUTUHAN KHUSUS --- */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-red-100">
                                    <Heart className="w-5 h-5 text-red-600" />
                                    <h3 className="text-base font-semibold text-gray-900">D. Kebutuhan Khusus</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Memiliki Kebutuhan Khusus?</label>
                                        <select 
                                            name="memiliki_kebutuhan_khusus" 
                                            value={form.memiliki_kebutuhan_khusus ? "true" : "false"} 
                                            onChange={(e) => setForm({ ...form, memiliki_kebutuhan_khusus: e.target.value === "true" })} 
                                            className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        >
                                            <option value="false">Tidak</option>
                                            <option value="true">Ya</option>
                                        </select>
                                    </div>

                                    {(form.memiliki_kebutuhan_khusus === true || form.memiliki_kebutuhan_khusus === "true") && (
                                        <div className="space-y-3 p-4 bg-red-50/50 rounded-lg border border-red-100">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-2">Jenis Kebutuhan Khusus</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {kebutuhanKhususOptions.map(opt => (
                                                        <label key={opt.id} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                                            <input
                                                                type="checkbox"
                                                                value={opt.id}
                                                                checked={form.jenis_kebutuhan_khusus?.includes(opt.id)}
                                                                onChange={handleKebutuhanKhusus}
                                                                className="rounded text-red-600 focus:ring-red-500"
                                                            />
                                                            <span>{opt.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Kebutuhan Khusus</label>
                                                <textarea
                                                    name="deskripsi_kebutuhan_khusus"
                                                    rows={2}
                                                    value={form.deskripsi_kebutuhan_khusus || ""}
                                                    onChange={handleChange}
                                                    className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                                                    placeholder="Jelaskan kebutuhan khusus atau penanganan yang diperlukan..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- BAGIAN E: DATA ADMINISTRATIF MADRASAH --- */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-indigo-100">
                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                    <h3 className="text-base font-semibold text-gray-900">E. Data Administratif Madrasah</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-indigo-50/40 p-4 rounded-lg border border-indigo-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Induk (NIPD/NISN)</label>
                                        <input 
                                            type="text" 
                                            name="nomor_induk" 
                                            placeholder="Contoh: 2026001 / NISN" 
                                            value={form.nomor_induk || ""} 
                                            onChange={handleChange} 
                                            className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Diterima di Kelas</label>
                                        <input 
                                            type="text" 
                                            name="diterima_di_kelas" 
                                            placeholder="Contoh: Kelas 1, 1A" 
                                            value={form.diterima_di_kelas || ""} 
                                            onChange={handleChange} 
                                            className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Diterima pada Tanggal</label>
                                        <input 
                                            type="date" 
                                            name="diterima_pada_tanggal" 
                                            value={form.diterima_pada_tanggal ? form.diterima_pada_tanggal.slice(0, 10) : ""} 
                                            onChange={handleChange} 
                                            className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isSaving}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Simpan Perubahan</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}