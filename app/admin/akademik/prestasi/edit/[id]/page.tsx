import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EditPrestasiForm from "./EditPrestasiForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPrestasiPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const prestasiId = parseInt(id, 10);

    if (isNaN(prestasiId)) {
        console.error("ID Prestasi tidak valid:", id);
        return redirect('/admin/akademik');
    }

    const { data: prestasi, error } = await supabase
        .from('prestasi')
        .select('*')
        .eq('id', prestasiId)
        .single();
    
    if (error || !prestasi) {
        console.error('Error fetching prestasi:', error);
        return redirect('/admin/akademik');
    }

    let imageUrl: string | null = null;
    if (prestasi.dokumentasi_url) {
        const { data } = supabase.storage
            .from('dokumentasi-prestasi') // NAMA BUCKET YANG BENAR
            .getPublicUrl(prestasi.dokumentasi_url);
        imageUrl = data.publicUrl;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/akademik"><ArrowLeft size={16} className="mr-2" />Kembali</Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Prestasi</h1>
            </div>

            <EditPrestasiForm prestasi={prestasi} imageUrl={imageUrl} />
        </div>
    );
}