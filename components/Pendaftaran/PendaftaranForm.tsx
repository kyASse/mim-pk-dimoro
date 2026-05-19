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
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Users, Home, Heart, FileText, Send } from "lucide-react";
import { SCHOOL_NAME, SCHOOL_WHATSAPP } from "@/lib/school-config";

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
    
    memiliki_kebutuhan_khusus: z.boolean(),
    jenis_kebutuhan_khusus: z.array(z.string()),
    deskripsi_kebutuhan_khusus: z.string().optional(),
    dokumen_pendukung: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PendaftaranForm() {
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            nama_lengkap: "",
            nama_panggilan: "",
            jenis_kelamin: "" as any,
            kewarganegaraan: "" as any,
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

    async function onSubmit(values: FormValues): Promise<void> {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">
                {/* A. Keterangan Anak */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold tracking-tight">A. Keterangan Anak (Data Siswa)</h3>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="nama_lengkap" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Lengkap</FormLabel>
                                <FormControl><Input placeholder="Sesuai akta kelahiran" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nama_panggilan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Panggilan</FormLabel>
                                <FormControl><Input placeholder="Nama panggilan anak" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="jenis_kelamin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Kelamin</FormLabel>
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="tempat_lahir" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tempat Lahir</FormLabel>
                                    <FormControl><Input placeholder="Kota/Kabupaten" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tanggal_lahir" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Lahir</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="agama" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agama</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="kewarganegaraan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kewarganegaraan</FormLabel>
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="anak_ke" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Anak ke</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="jumlah_saudara_kandung" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jumlah Saudara</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="status_anak" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status Anak</FormLabel>
                                <FormControl><Input placeholder="Contoh: Anak Kandung" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="bahasa_sehari_hari" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bahasa Sehari-hari</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="berat_badan" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Berat Badan (Kg)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tinggi_badan" render={({ field }) => (
                                <FormItem>
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
                                    <FormLabel>Golongan Darah</FormLabel>
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
                                <FormLabel>Cita-cita</FormLabel>
                                <FormControl><Input placeholder="Apa impian anak?" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="alamat_lengkap" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat Tempat Tinggal</FormLabel>
                                <FormControl><Textarea rows={3} placeholder="Alamat lengkap saat ini" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="nomor_telepon" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nomor Telepon/HP (WhatsApp)</FormLabel>
                                <FormControl><Input type="tel" placeholder="08..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="jarak_tempat_tinggal" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jarak ke Sekolah</FormLabel>
                                <FormControl><Input placeholder="Contoh: ± 1 Km" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </div>

                {/* B. Orang Tua */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold tracking-tight">B. Orang Tua (Data Ayah & Ibu)</h3>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
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
                                <FormControl><Input placeholder="Contoh: S1 Teknik" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pendidikan_ibu" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Ibu</FormLabel>
                                <FormControl><Input placeholder="Contoh: D3 Akuntansi" {...field} /></FormControl>
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
                            <FormItem className="md:col-span-2">
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
                        <h3 className="text-lg font-semibold tracking-tight">C. Wali Anak</h3>
                    </div>
                    <p className="text-sm text-muted-foreground -mt-4">Diisi hanya jika calon siswa tidak tinggal bersama orang tua kandung.</p>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="wali_nama" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Wali</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_pendidikan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Wali</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="wali_hubungan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hubungan dengan Wali</FormLabel>
                                <FormControl><Input placeholder="Contoh: Paman, Kakek" {...field} /></FormControl>
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
                </div>

                {/* D. Kebutuhan Khusus */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold tracking-tight">D. Kebutuhan Khusus</h3>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="memiliki_kebutuhan_khusus"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-5 bg-muted/30">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base">
                                            Apakah calon siswa memiliki kebutuhan khusus?
                                        </FormLabel>
                                        <FormDescription>
                                            Kami berkomitmen memberikan pendidikan yang inklusif.
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
                                                        Anda dapat memilih lebih dari satu opsi.
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
                                            <FormLabel>Deskripsi Lengkap</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Mohon jelaskan kondisi spesifik, riwayat penanganan, atau kebutuhan khusus lainnya agar kami dapat melayani dengan baik."
                                                    className="min-h-[120px] resize-none"
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
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <FormLabel>Dokumen Pendukung (Opsional)</FormLabel>
                                            </div>
                                            <FormControl>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Input 
                                                        type="file" 
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => field.onChange(e.target.files)}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Format: PDF, JPG, PNG (Maks. 5MB). Contoh: Hasil psikotes, surat medis.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        size="lg"
                        className="w-full text-base font-semibold h-12 shadow-lg shadow-primary/20" 
                        disabled={form.formState.isSubmitting || isUploading}
                    >
                        {form.formState.isSubmitting || isUploading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim data...</>
                        ) : (
                            <><Send className="mr-2 h-5 w-5" /> Kirim Formulir Pendaftaran</>
                        )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                        Dengan mengirimkan formulir ini, Anda menyetujui bahwa data yang diberikan adalah benar dan sah.
                    </p>
                </div>
            </form>
        </Form>
    );
}
