// app/admin/kalender/tambah/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft } from "lucide-react";
import TambahKegiatanForm from "./TambahKegiatanForm";

export default function TambahKegiatanPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Link href="/admin/kalender" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Kalender
                        </Link>
                    </Button>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tambah Kegiatan Akademik</h1>
                        <p className="text-gray-600 mt-1">Buat kegiatan baru untuk kalender akademik</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <Card className="border border-gray-200">
                <CardHeader>
                    <CardTitle>Informasi Kegiatan</CardTitle>
                    <CardDescription>
                        Lengkapi formulir di bawah ini untuk menambahkan kegiatan baru ke kalender akademik
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TambahKegiatanForm />
                </CardContent>
            </Card>
        </div>
    );
}