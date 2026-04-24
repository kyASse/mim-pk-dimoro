"use client";

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { categoryColors, availableCategories } from '@/lib/constants/calendar';
import { updateKegiatanAction } from '../../actions';
import { useRouter } from 'next/navigation';

type KegiatanAkademik = {
    id: number;
    judul: string;
    tanggal: string;
    tanggal_berakhir: string | null;
    waktu: string | null;
    kategori: string;
    deskripsi: string | null;
    warna: string;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                </>
            )}
        </Button>
    );
}

export default function EditKegiatanForm({ kegiatan }: { kegiatan: KegiatanAkademik }) {
    const [selectedKategori, setSelectedKategori] = useState(kegiatan.kategori);
    const updateKegiatanWithId = updateKegiatanAction.bind(null, kegiatan.id);
    const [state, formAction] = useActionState(updateKegiatanWithId, { success: false, message: "" });
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin/kalender');
        }
    }, [state?.success, router]);

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Judul Kegiatan */}
                <div className="md:col-span-2">
                    <Label htmlFor="judul" className="text-sm font-medium text-gray-700">
                        Judul Kegiatan *
                    </Label>
                    <Input
                        id="judul"
                        name="judul"
                        required
                        defaultValue={kegiatan.judul}
                        placeholder="Masukkan judul kegiatan"
                        className="mt-1"
                    />
                </div>

                {/* Tanggal Mulai */}
                <div>
                    <Label htmlFor="tanggal" className="text-sm font-medium text-gray-700">
                        Tanggal Mulai *
                    </Label>
                    <Input
                        id="tanggal"
                        name="tanggal"
                        type="date"
                        required
                        defaultValue={kegiatan.tanggal}
                        className="mt-1"
                    />
                </div>

                {/* Tanggal Berakhir */}
                <div>
                    <Label htmlFor="tanggal_berakhir" className="text-sm font-medium text-gray-700">
                        Tanggal Berakhir (Opsional)
                    </Label>
                    <Input
                        id="tanggal_berakhir"
                        name="tanggal_berakhir"
                        type="date"
                        defaultValue={kegiatan.tanggal_berakhir || ''}
                        className="mt-1"
                        placeholder="Kosongkan untuk kegiatan 1 hari"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Kosongkan jika kegiatan hanya berlangsung 1 hari
                    </p>
                </div>

                {/* Waktu */}
                <div>
                    <Label htmlFor="waktu" className="text-sm font-medium text-gray-700">
                        Waktu (Opsional)
                    </Label>
                    <Input
                        id="waktu"
                        name="waktu"
                        type="time"
                        defaultValue={kegiatan.waktu || ''}
                        className="mt-1"
                        placeholder="Kosongkan untuk acara sepanjang hari"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Kosongkan jika acara berlangsung sepanjang hari
                    </p>
                </div>

                {/* Kategori */}
                <div className="md:col-span-2">
                    <Label htmlFor="kategori" className="text-sm font-medium text-gray-700">
                        Kategori *
                    </Label>
                    <Select 
                        name="kategori" 
                        value={selectedKategori}
                        onValueChange={setSelectedKategori}
                        required
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Pilih kategori kegiatan" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableCategories.map(category => (
                                <SelectItem key={category} value={category}>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{ backgroundColor: categoryColors[category] }}
                                        />
                                        {category}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {/* Preview warna */}
                    <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-md">
                        <div 
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: categoryColors[selectedKategori] || '#3b82f6' }}
                        />
                        <span className="text-sm text-gray-600">
                            Warna: {categoryColors[selectedKategori] || '#3b82f6'}
                        </span>
                    </div>
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                    <Label htmlFor="deskripsi" className="text-sm font-medium text-gray-700">
                        Deskripsi (Opsional)
                    </Label>
                    <Textarea
                        id="deskripsi"
                        name="deskripsi"
                        rows={4}
                        defaultValue={kegiatan.deskripsi || ''}
                        placeholder="Masukkan deskripsi kegiatan (opsional)"
                        className="mt-1 resize-y"
                    />
                </div>
            </div>

            {/* Hidden warna field */}
            <input 
                type="hidden" 
                name="warna" 
                value={categoryColors[selectedKategori] || '#3b82f6'} 
            />

            {/* Error Message */}
            {state && !state.success && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{state.message}</p>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
                <SubmitButton />
            </div>
        </form>
    );
}
