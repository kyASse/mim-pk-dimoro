'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { submitPendaftaranAction } from "@/app/pendaftaran/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Users, Home, Heart, FileText, Send, Copy } from "lucide-react";
import { SCHOOL_NAME, SCHOOL_WHATSAPP } from "@/lib/school-config";

// Opsi kebutuhan khusus
const jenisKebutuhanKhususItems = [
    { id: "gangguan_penglihatan", label: "Gangguan Penglihatan" },
    { id: "gangguan_pendengaran", label: "Gangguan Pendengaran" },
    { id: "gangguan_komunikasi", label: "Gangguan Komunikasi / Wicara" },
    { id: "autisme", label: "Spektrum Autisme (ASD)" },
    { id: "adhd", label: "ADHD (Attention Deficit Hyperactivity Disorder)" },
    { id: "kesulitan_belajar", label: "Kesulitan Belajar Spesifik" },
    { id: "hambatan_fisik", label: "Hambatan Fisik / Motorik" },
    { id: "lainnya", label: "Lainnya" },
] as const;

const opsiStatusAnak = [
    "Anak Kandung",
    "Anak Tiri",
    "Anak Angkat",
    "Lainnya",
] as const;

const opsiPendidikan = [
    "SD / MI",
    "SMP / MTs",
    "SMA / SMK / MA",
    "D1 / D2 / D3",
    "S1 / Sarjana",
    "S2 / Magister",
    "S3 / Doktor",
    "Tidak Sekolah",
    "Lainnya",
] as const;

const opsiTransportasi = [
    "Jalan Kaki",
    "Sepeda",
    "Sepeda Motor",
    "Mobil Pribadi",
    "Antar Jemput",
    "Angkutan Umum",
    "Lainnya",
] as const;

const opsiPenghasilan = [
    "< Rp 1.000.000",
    "Rp 1.000.000 - Rp 3.000.000",
    "Rp 3.000.000 - Rp 5.000.000",
    "> Rp 5.000.000",
    "Lainnya",
] as const;

const opsiGolonganDarah = [
    "A",
    "B",
    "AB",
    "O",
    "Belum Tahu",
] as const;

// Skema validasi Zod untuk formulir pendaftaran 27 item
const formSchema = z.object({
    // A. Keterangan Anak
    nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    nama_panggilan: z.string().min(1, "Nama panggilan wajib diisi"),
    jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], { required_error: "Jenis kelamin wajib dipilih." }),
    tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
    agama: z.string().min(1, "Agama wajib diisi"),
    kewarganegaraan: z.enum(["WNI", "WNA"], { required_error: "Kewarganegaraan wajib dipilih." }),
    status_anak: z.string().optional(),
    anak_ke: z.string().optional(),
    jumlah_saudara_kandung: z.string().optional(),
    bahasa_sehari_hari: z.string().optional(),
    tk_asal: z.string().optional(),
    cita_cita: z.string().optional(),
    hobi: z.string().optional(),
    alamat_lengkap: z.string().min(1, "Alamat wajib diisi"),
    nomor_telepon: z.string().min(1, "Nomor telepon wajib diisi"),
    jarak_tempat_tinggal: z.string().optional(),
    transportasi: z.string().optional(),
    berat_badan: z.string().optional(),
    tinggi_badan: z.string().optional(),
    golongan_darah: z.string().optional(),

    // B. Orang Tua
    nama_ayah_kandung: z.string().optional(),
    pendidikan_ayah: z.string().optional(),
    pekerjaan_ayah: z.string().optional(),
    nama_ibu_kandung: z.string().optional(),
    pendidikan_ibu: z.string().optional(),
    pekerjaan_ibu: z.string().optional(),
    alamat_orang_tua: z.string().optional(),
    gaji_orang_tua: z.string().optional(),
    email: z.string().email("Email tidak valid").optional().or(z.literal("")),

    // C. Wali Anak
    wali_nama: z.string().optional(),
    wali_hubungan: z.string().optional(),
    wali_pendidikan: z.string().optional(),
    wali_pekerjaan: z.string().optional(),
    wali_alamat: z.string().optional(),
    wali_telepon: z.string().optional(),

    // D. Kebutuhan Khusus & Dokumen
    memiliki_kebutuhan_khusus: z.boolean(),
    jenis_kebutuhan_khusus: z.array(z.string()),
    deskripsi_kebutuhan_khusus: z.string().optional(),
    dokumen_pendukung: z.any().optional(),
});

export default function PendaftaranForm() {
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            nama_lengkap: "",
            nama_panggilan: "",
            jenis_kelamin: undefined as any,
            tempat_lahir: "",
            tanggal_lahir: "",
            agama: "Islam",
            kewarganegaraan: "WNI" as any,
            status_anak: "Anak Kandung",
            anak_ke: "",
            jumlah_saudara_kandung: "",
            bahasa_sehari_hari: "Bahasa Indonesia",
            tk_asal: "",
            cita_cita: "",
            hobi: "",
            alamat_lengkap: "",
            nomor_telepon: "",
            jarak_tempat_tinggal: "",
            transportasi: "",
            berat_badan: "",
            tinggi_badan: "",
            golongan_darah: "",

            nama_ayah_kandung: "",
            pendidikan_ayah: "",
            pekerjaan_ayah: "",
            nama_ibu_kandung: "",
            pendidikan_ibu: "",
            pekerjaan_ibu: "",
            alamat_orang_tua: "",
            gaji_orang_tua: "",
            email: "",

            wali_nama: "",
            wali_hubungan: "",
            wali_pendidikan: "",
            wali_pekerjaan: "",
            wali_alamat: "",
            wali_telepon: "",

            memiliki_kebutuhan_khusus: false,
            jenis_kebutuhan_khusus: [],
            deskripsi_kebutuhan_khusus: "",
            dokumen_pendukung: undefined,
        },
    });

    const hasSpecialNeeds = form.watch("memiliki_kebutuhan_khusus");

    useEffect(() => {
        if (isSuccess) {
            toast.success("Pendaftaran Berhasil", {
                description: (
                    <div className="flex flex-col gap-2">
                        <p className="text-muted-foreground">
                            Terima kasih. Langkah selanjutnya, silakan konfirmasi pendaftaran ke nomor WhatsApp <strong>{SCHOOL_NAME}</strong> di <strong>{SCHOOL_WHATSAPP}</strong> dengan format:
                        </p>
                        <pre className="bg-muted p-3 rounded-md border text-xs whitespace-pre-wrap break-words font-mono">
                            KONFIRMASI PENDAFTARAN - {form.getValues("nama_lengkap")}
                        </pre>
                    </div>
                ),
                duration: 30000,
                onAutoClose: () => {
                    window.location.href = "/";
                },
            });
        }
    }, [isSuccess, form]);

    const handleCopyAddress = () => {
        const studentAddress = form.getValues("alamat_lengkap");
        if (!studentAddress) {
            toast.warning("Alamat tempat tinggal siswa belum diisi");
            return;
        }
        form.setValue("alamat_orang_tua", studentAddress, { shouldValidate: true });
        toast.success("Alamat tempat tinggal siswa disalin ke alamat orang tua");
    };

    async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            console.debug('=== FORM SUBMIT STARTED ===');
            console.debug('Form values:', values);
        }

        toast.info("Memproses pendaftaran...", {
            description: "Mohon tunggu, data sedang disimpan"
        });

        try {
            const fd = new FormData();
            Object.entries(values).forEach(([key, val]) => {
                if (key === 'dokumen_pendukung') {
                    const file = values.dokumen_pendukung?.[0];
                    if (file) {
                        fd.append('dokumen_pendukung', file);
                    }
                } else if (key === 'memiliki_kebutuhan_khusus') {
                    fd.append('memiliki_kebutuhan_khusus', String(Boolean(val)));
                } else if (key === 'jenis_kebutuhan_khusus') {
                    fd.append('jenis_kebutuhan_khusus', JSON.stringify(val || []));
                } else if (val !== undefined && val !== null) {
                    fd.append(key, String(val));
                }
            });

            const res = await submitPendaftaranAction(fd);
            if (!res.success) {
                toast.error(res.message || "Gagal mengirim pendaftaran");
                return;
            }

            setIsSuccess(true);
            form.reset();

        } catch (err) {
            if (err instanceof Error) {
                console.error('Submit error:', err);
                toast.error("Gagal mengirim pendaftaran", {
                    description: err.message
                });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">
                {/* A. Keterangan Anak */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">A. Keterangan Anak (Data Peserta Didik)</h3>
                            <p className="text-xs text-muted-foreground">Isi data calon peserta didik baru sesuai akta kelahiran dan kartu keluarga.</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="nama_lengkap" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Lengkap <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input placeholder="Sesuai akta kelahiran" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nama_panggilan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Panggilan <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input placeholder="Nama panggilan anak" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="jenis_kelamin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Kelamin <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kewarganegaraan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kewarganegaraan <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kewarganegaraan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="WNI">WNI (Warga Negara Indonesia)</SelectItem>
                                            <SelectItem value="WNA">WNA (Warga Negara Asing)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="tempat_lahir" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tempat Lahir <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input placeholder="Kota/Kabupaten" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tanggal_lahir" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Lahir <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="agama" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agama <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input placeholder="Islam" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField
                                control={form.control}
                                name="status_anak"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status dalam Keluarga</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status anak" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {opsiStatusAnak.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="anak_ke" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Anak ke</FormLabel>
                                    <FormControl><Input type="number" min="1" placeholder="Contoh: 1" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="jumlah_saudara_kandung" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jumlah Saudara Kandung</FormLabel>
                                    <FormControl><Input type="number" min="0" placeholder="Contoh: 2" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="bahasa_sehari_hari" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bahasa Sehari-hari</FormLabel>
                                    <FormControl><Input placeholder="Contoh: Bahasa Indonesia" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tk_asal" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RA / TK Asal</FormLabel>
                                    <FormControl><Input placeholder="Nama TK/RA asal" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="cita_cita" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cita-cita</FormLabel>
                                    <FormControl><Input placeholder="Contoh: Guru, Dokter" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="hobi" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hobi</FormLabel>
                                    <FormControl><Input placeholder="Contoh: Membaca, Menggambar" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="alamat_lengkap" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Alamat Tempat Tinggal Siswa <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Textarea rows={3} placeholder="Alamat lengkap (Dusun, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota)" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nomor_telepon" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nomor Telepon/HP (WhatsApp) <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input type="tel" placeholder="08xxxxxxxxxx" {...field} /></FormControl>
                                <FormDescription>Nomor aktif untuk konfirmasi & komunikasi madrasah</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="jarak_tempat_tinggal" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jarak ke Sekolah</FormLabel>
                                    <FormControl><Input placeholder="Contoh: ± 1 Km" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField
                                control={form.control}
                                name="transportasi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transportasi ke Sekolah</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih transportasi" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {opsiTransportasi.map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4 md:col-span-2">
                            <FormField control={form.control} name="berat_badan" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Berat Badan (Kg)</FormLabel>
                                    <FormControl><Input type="number" placeholder="Contoh: 20" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tinggi_badan" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tinggi Badan (Cm)</FormLabel>
                                    <FormControl><Input type="number" placeholder="Contoh: 115" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField
                                control={form.control}
                                name="golongan_darah"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Golongan Darah</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {opsiGolonganDarah.map((gol) => (
                                                    <SelectItem key={gol} value={gol}>
                                                        {gol}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* B. Orang Tua */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">B. Orang Tua (Data Ayah & Ibu)</h3>
                            <p className="text-xs text-muted-foreground">Informasi identitas dan kontak orang tua kandung peserta didik.</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="nama_ayah_kandung" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Ayah Kandung</FormLabel>
                                <FormControl><Input placeholder="Nama lengkap ayah" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nama_ibu_kandung" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Ibu Kandung</FormLabel>
                                <FormControl><Input placeholder="Nama lengkap ibu" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="pendidikan_ayah"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Terakhir Ayah</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenjang pendidikan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {opsiPendidikan.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pendidikan_ibu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Terakhir Ibu</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenjang pendidikan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {opsiPendidikan.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="pekerjaan_ayah" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pekerjaan Ayah</FormLabel>
                                <FormControl><Input placeholder="Contoh: Wiraswasta, Karyawan Swasta, PNS" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pekerjaan_ibu" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pekerjaan Ibu</FormLabel>
                                <FormControl><Input placeholder="Contoh: Ibu Rumah Tangga, Guru, Wiraswasta" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="alamat_orang_tua"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Alamat Orang Tua</FormLabel>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopyAddress}
                                            className="h-7 text-xs font-normal text-primary hover:text-primary/80 gap-1 px-2"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            Salin dari alamat tempat tinggal siswa
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <Textarea rows={2} placeholder="Alamat domisili orang tua saat ini" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gaji_orang_tua"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Penghasilan / Gaji Orang Tua</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih rentang penghasilan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {opsiPenghasilan.map((gaji) => (
                                                <SelectItem key={gaji} value={gaji}>
                                                    {gaji}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat Email</FormLabel>
                                <FormControl><Input type="email" placeholder="email@contoh.com" {...field} /></FormControl>
                                <FormDescription>Digunakan untuk akses ke Portal Orang Tua {SCHOOL_NAME}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </div>

                {/* C. Wali Anak */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">C. Wali Anak (Opsional)</h3>
                            <p className="text-xs text-muted-foreground">Diisi hanya jika calon siswa tinggal bersama wali.</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="wali_nama" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Lengkap Wali</FormLabel>
                                <FormControl><Input placeholder="Nama lengkap wali" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_hubungan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hubungan dengan Calon Siswa</FormLabel>
                                <FormControl><Input placeholder="Contoh: Kakek, Nenek, Paman, Tante, Kakak" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="wali_pendidikan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Terakhir Wali</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenjang pendidikan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {opsiPendidikan.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="wali_pekerjaan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pekerjaan Wali</FormLabel>
                                <FormControl><Input placeholder="Pekerjaan wali" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_alamat" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat Tempat Tinggal Wali</FormLabel>
                                <FormControl><Textarea rows={2} placeholder="Alamat domisili wali" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_telepon" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nomor Telepon/HP (WhatsApp) Wali</FormLabel>
                                <FormControl><Input type="tel" placeholder="08xxxxxxxxxx" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </div>

                {/* D. Kebutuhan Khusus & Dokumen Pendukung */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">D. Kebutuhan Khusus & Dokumen Pendukung (Opsional)</h3>
                            <p className="text-xs text-muted-foreground">Layanan pendidikan inklusif dan berkas lampiran pendukung.</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="memiliki_kebutuhan_khusus"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-5 bg-muted/30">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base font-semibold">
                                            Apakah calon siswa memiliki kebutuhan khusus?
                                        </FormLabel>
                                        <FormDescription>
                                            {SCHOOL_NAME} berkomitmen memberikan pendidikan yang ramah dan inklusif bagi semua anak.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {hasSpecialNeeds && (
                            <div className="flex flex-col gap-8 pl-6 border-l-2 border-primary/30 animate-in fade-in slide-in-from-left-4 duration-300">
                                <FormField
                                    control={form.control}
                                    name="jenis_kebutuhan_khusus"
                                    render={() => (
                                        <FormItem>
                                            <fieldset>
                                                <div className="mb-4">
                                                    <legend className="text-base font-medium">Jenis Kebutuhan Khusus</legend>
                                                    <FormDescription>
                                                        Anda dapat memilih lebih dari satu opsi yang sesuai.
                                                    </FormDescription>
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    {jenisKebutuhanKhususItems.map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="jenis_kebutuhan_khusus"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={(field.value as string[])?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                const value = (field.value as string[]) || [];
                                                                                return checked
                                                                                    ? field.onChange([...value, item.id])
                                                                                    : field.onChange(
                                                                                        value.filter((v) => v !== item.id)
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal leading-tight cursor-pointer">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </fieldset>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="deskripsi_kebutuhan_khusus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deskripsi Lengkap Kebutuhan Khusus</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Mohon jelaskan kondisi spesifik, riwayat penanganan medis/terapi, atau kebutuhan pendampingan lainnya agar kami dapat mempersiapkan pelayanan terbaik."
                                                    className="min-h-[120px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="dokumen_pendukung"
                            render={({ field }) => (
                                <FormItem className="rounded-xl border p-5 bg-muted/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <div>
                                            <FormLabel className="text-base font-semibold">Dokumen Pendukung (Opsional)</FormLabel>
                                            <p className="text-xs text-muted-foreground">Upload berkas seperti hasil psikotes, surat medis, atau sertifikat prestasi.</p>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <div className="grid w-full max-w-md items-center gap-1.5 mt-3">
                                            <Input 
                                                type="file" 
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => field.onChange(e.target.files)}
                                                className="cursor-pointer bg-background"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="mt-2">
                                        Format berkas: PDF, JPG, PNG (Maksimal 5MB).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        size="lg"
                        className="w-full text-base font-semibold h-12 shadow-lg shadow-primary/20" 
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim data formulir...</>
                        ) : (
                            <><Send className="mr-2 h-5 w-5" /> Kirim Formulir Pendaftaran</>
                        )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                        Dengan mengirimkan formulir ini, Anda menyetujui bahwa seluruh data yang diisikan adalah benar dan sah.
                    </p>
                </div>
            </form>
        </Form>
    );
}
