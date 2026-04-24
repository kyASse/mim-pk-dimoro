// components/Pendaftaran/PendaftaranForm.tsx
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
import { createClient } from "@/lib/supabase/client";
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
import { Loader2 } from "lucide-react";

// Definisikan opsi kebutuhan khusus
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


// Perbarui skema form dengan kolom kebutuhan khusus
const formSchema = z.object({
    nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    nama_panggilan: z.string().min(1, "Nama panggilan wajib diisi"),
    jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], { required_error: "Jenis kelamin wajib dipilih."}),
    tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
    agama: z.string().min(1, "Agama wajib diisi"),
    kewarganegaraan: z.enum(["WNI", "WNA"], { required_error: "Kewarganegaraan wajib dipilih."}),
    anak_ke: z.string().optional(),
    jumlah_saudara_kandung: z.string().optional(),
    status_anak: z.string().optional(),
    bahasa_sehari_hari: z.string().optional(),
    berat_badan: z.string().optional(),
    tinggi_badan: z.string().optional(),
    golongan_darah: z.string().optional(),
    cita_cita: z.string().optional(),
    alamat_lengkap: z.string().min(1, "Alamat wajib diisi"),
    nomor_telepon: z.string().min(1, "Nomor telepon wajib diisi"),
    jarak_tempat_tinggal: z.string().optional(),
    nama_ayah_kandung: z.string().optional(),
    pendidikan_ayah: z.string().optional(),
    pekerjaan_ayah: z.string().optional(),
    nama_ibu_kandung: z.string().optional(),
    pendidikan_ibu: z.string().optional(),
    pekerjaan_ibu: z.string().optional(),
    email: z.string().email("Email tidak valid"),
    wali_nama: z.string().optional(),
    wali_pendidikan: z.string().optional(),
    wali_hubungan: z.string().optional(),
    wali_pekerjaan: z.string().optional(),
    
    memiliki_kebutuhan_khusus: z.boolean().default(false),
    jenis_kebutuhan_khusus: z.array(z.string()).optional(),
    deskripsi_kebutuhan_khusus: z.string().optional(),
    dokumen_pendukung: z.any().optional(),
});



export default function PendaftaranForm() {
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onSubmit" as const,
        defaultValues: {
            nama_lengkap: "",
            nama_panggilan: "",
            jenis_kelamin: undefined,
            kewarganegaraan: undefined,
            tempat_lahir: "",
            tanggal_lahir: "",
            agama: "",
            anak_ke: "",
            jumlah_saudara_kandung: "",
            status_anak: "",
            bahasa_sehari_hari: "",
            berat_badan: "",
            tinggi_badan: "",
            golongan_darah: "",
            cita_cita: "",
            alamat_lengkap: "",
            nomor_telepon: "",
            jarak_tempat_tinggal: "",
            nama_ayah_kandung: "",
            pendidikan_ayah: "",
            pekerjaan_ayah: "",
            nama_ibu_kandung: "",
            pendidikan_ibu: "",
            pekerjaan_ibu: "",
            email: "",
            wali_nama: "",
            wali_pendidikan: "",
            wali_hubungan: "",
            wali_pekerjaan: "",
            memiliki_kebutuhan_khusus: false,
            jenis_kebutuhan_khusus: [],
            deskripsi_kebutuhan_khusus: "",
        },
    });

    const hasSpecialNeeds = form.watch("memiliki_kebutuhan_khusus");

    useEffect(() => {
        if (isSuccess) {
            toast.success("Pendaftaran Berhasil", {
                description: (
                    <div>
                        <p className="text-muted-foreground">
                            Terima kasih. Langkah selanjutnya, silakan konfirmasi pendaftaran ke nomor WhatsApp sekolah di <strong>0812-3456-7890</strong> (ganti nomor) dengan format:
                        </p>
                        <pre className="text-muted-foreground p-4 rounded mt-2 border border-muted-200 whitespace-pre-wrap break-words">
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

    async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
        // Notify developers about form submission in non-production environments
        if (process.env.NODE_ENV !== 'production') {
            console.debug('=== FORM SUBMIT STARTED ===');
            console.debug('Form values:', values);
        }
        
        // Tampilkan notifikasi bahwa form sedang diproses
        toast.info("Memproses pendaftaran...", {
            description: "Mohon tunggu, data sedang disimpan"
        });
        
        setIsUploading(false);
        try {
            let dokumen_pendukung_url: string | null = null;
            const file = values.dokumen_pendukung?.[0];

            if (file) {
                setIsUploading(true);
                const fileName = `${Date.now()}_${file.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('dokumen-pendukung')
                    .upload(fileName, file);

                if (uploadError) {
                    throw new Error(`Gagal mengunggah dokumen: ${uploadError.message}`);
                }
                // Simpan hanya path object; akses dilakukan via URL bertanda tangan
                dokumen_pendukung_url = uploadData.path;
                setIsUploading(false);
            }
            
            const dataToSubmit = {
                ...values,
                anak_ke: values.anak_ke ? parseInt(values.anak_ke) : null,
                jumlah_saudara_kandung: values.jumlah_saudara_kandung ? parseInt(values.jumlah_saudara_kandung) : null,
                berat_badan: values.berat_badan ? parseInt(values.berat_badan) : null,
                tinggi_badan: values.tinggi_badan ? parseInt(values.tinggi_badan) : null,
                jalur_pendaftaran: "Online",
                memiliki_kebutuhan_khusus: values.memiliki_kebutuhan_khusus,

                jenis_kebutuhan_khusus: values.memiliki_kebutuhan_khusus
                    ? (Array.isArray(values.jenis_kebutuhan_khusus)
                        ? values.jenis_kebutuhan_khusus
                        : (typeof values.jenis_kebutuhan_khusus === "string"
                            ? JSON.parse(values.jenis_kebutuhan_khusus)
                            : []))
                    : [],

                deskripsi_kebutuhan_khusus: values.memiliki_kebutuhan_khusus ? values.deskripsi_kebutuhan_khusus : "",
                dokumen_pendukung_url: dokumen_pendukung_url,
            };
            
            // Hapus field yang tidak ada di database atau tidak diperlukan
            delete (dataToSubmit as any).dokumen_pendukung;
            delete (dataToSubmit as any).email; // Email tidak ada di schema database pendaftar

            // Data preparation complete, ready to insert into the database.

            const { data: insertData, error: insertError } = await supabase.from("pendaftar").insert([dataToSubmit]);
            if (insertError) {
                console.error('Database insert error:', insertError);
                throw insertError;
            }
            
            console.log('Data berhasil disimpan:', insertData);
            
            // Jangan tampilkan toast sukses di sini, biarkan useEffect yang handle
            // karena useEffect akan menampilkan toast dengan WhatsApp link
            
            setIsSuccess(true);
            form.reset();

        } catch (err) {
            if (err instanceof Error) {
                console.error('Submit error:', err);
                toast.error("Gagal mengirim pendaftaran", {
                    description: err.message
                });
            }
            setIsUploading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <fieldset className="flex flex-col gap-4 border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">A. Keterangan Anak</legend>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="nama_lengkap" render={({ field }) => (
                            <FormItem>
                                <FormLabel>1. Nama Lengkap</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nama_panggilan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>2. Nama Panggilan</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="jenis_kelamin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>3. Jenis Kelamin</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <FormField control={form.control} name="tempat_lahir" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>4. Tempat Lahir</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tanggal_lahir" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Tanggal Lahir</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="agama" render={({ field }) => (
                            <FormItem>
                                <FormLabel>5. Agama</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="kewarganegaraan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>6. Kewarganegaraan</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kewarganegaraan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="WNI">WNI</SelectItem>
                                                <SelectItem value="WNA">WNA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="anak_ke" render={({ field }) => (
                            <FormItem>
                                <FormLabel>7. Anak ke</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="jumlah_saudara_kandung" render={({ field }) => (
                            <FormItem>
                                <FormLabel>8. Jumlah saudara kandung</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="status_anak" render={({ field }) => (
                            <FormItem>
                                <FormLabel>9. Status Anak</FormLabel>
                                <FormControl><Input placeholder="Contoh: Anak Kandung" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="bahasa_sehari_hari" render={({ field }) => (
                            <FormItem>
                                <FormLabel>10. Bahasa sehari-hari</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="flex gap-4">
                            <FormField control={form.control} name="berat_badan" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>11. Berat Badan (Kg)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tinggi_badan" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Tinggi Badan (Cm)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="golongan_darah"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>12. Golongan Darah</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih golongan darah" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="AB">AB</SelectItem>
                                                <SelectItem value="O">O</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="cita_cita" render={({ field }) => (
                            <FormItem>
                                <FormLabel>14. Cita-cita</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="alamat_lengkap" render={({ field }) => (
                            <FormItem>
                                <FormLabel>15. Alamat Tempat Tinggal</FormLabel>
                                <FormControl><Textarea rows={3} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nomor_telepon" render={({ field }) => (
                            <FormItem>
                                <FormLabel>16. Nomor Telepon/HP</FormLabel>
                                <FormControl><Input type="tel" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="jarak_tempat_tinggal" render={({ field }) => (
                            <FormItem>
                                <FormLabel>17. Jarak tempat tinggal</FormLabel>
                                <FormControl><Input placeholder="Contoh: ± 1 Km" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">B. Orang Tua</legend>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="nama_ayah_kandung" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Ayah Kandung</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nama_ibu_kandung" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Ibu Kandung</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pendidikan_ayah" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Ayah</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pendidikan_ibu" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Ibu</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pekerjaan_ayah" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pekerjaan Ayah</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pekerjaan_ibu" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pekerjaan Ibu</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat Email (untuk Portal Orang Tua)</FormLabel>
                                <FormControl><Input type="email" placeholder="contoh@email.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">C. Wali Anak (diisi jika tinggal bersama wali)</legend>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="wali_nama" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Wali</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_pendidikan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Tertinggi Wali</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_hubungan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hubungan dengan Wali</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_pekerjaan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pekerjaan Wali</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </fieldset>

                <fieldset className="flex flex-col gap-6 border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">D. Kebutuhan Khusus</legend>
                    <FormField
                        control={form.control}
                        name="memiliki_kebutuhan_khusus"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Apakah calon siswa memiliki kebutuhan khusus?
                                    </FormLabel>
                                    <FormDescription>
                                        Jika "Ya", mohon lengkapi informasi di bawah ini.
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
                        <div className="flex flex-col gap-4 pl-4 border-l-2 border-primary/20">
                            <FormField
                                control={form.control}
                                name="jenis_kebutuhan_khusus"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Jenis Kebutuhan Khusus</FormLabel>
                                            <FormDescription>
                                                Pilih satu atau lebih yang sesuai.
                                            </FormDescription>
                                        </div>
                                        {jenisKebutuhanKhususItems.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="jenis_kebutuhan_khusus"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...(field.value || []), item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="deskripsi_kebutuhan_khusus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi Rinci</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Jelaskan secara singkat kebutuhan khusus, riwayat penanganan, atau rekomendasi dari ahli (jika ada)."
                                                className="resize-y"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="dokumen_pendukung"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unggah Dokumen Pendukung (Opsional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file" 
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => field.onChange(e.target.files)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Contoh: Surat keterangan psikolog, laporan medis. (Maks. 5MB)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </fieldset>

                <Button 
                    type="submit" 
                    className="w-full mt-4" 
                    disabled={form.formState.isSubmitting || isUploading}
                >
                    {(form.formState.isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {(form.formState.isSubmitting || isUploading) ? "Mengirim..." : "Daftar Sekarang"}
                </Button>
            </form>
        </Form>
    );
}
