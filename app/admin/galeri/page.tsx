import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, ImageIcon } from "lucide-react";
import DeleteImageButton from "./DeleteImageButton"; 
import EditImageButton from "./EditImageButton";

type GaleriItem = {
    id: number;
    image_url: string;
    keterangan: string | null;
    kategori: string | null;
};


export default async function KelolaGaleriPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: galeri, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching galeri:', error);
        return <p>Gagal memuat data galeri.</p>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Galeri</h1>
                    <p className="text-gray-600">Kelola foto dan gambar untuk website sekolah</p>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                </Link>
                <Link href="/admin/galeri/tambah">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Foto
                    </Button>
                </Link>
            </div>

            {/* Gallery Grid */}
            {galeri && galeri.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galeri.map((item: GaleriItem) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-square">
                                <Image 
                                    src={item.image_url} 
                                    alt={item.keterangan || 'Gambar Galeri'} 
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm line-clamp-2">
                                        {item.keterangan || 'Tanpa Keterangan'}
                                    </h3>
                                    {item.kategori && (
                                        <Badge variant="secondary" className="text-xs">
                                            {item.kategori}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <EditImageButton
                                        galeriId={item.id}
                                        imageUrl={item.image_url}
                                        keterangan={item.keterangan}
                                        kategori={item.kategori}
                                    />
                                    <DeleteImageButton galeriId={item.id} imageUrl={item.image_url} /> 
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Galeri masih kosong</h3>
                            <p className="text-gray-600">Tambahkan foto pertama untuk memulai galeri</p>
                        </div>
                        <Link href="/admin/galeri/tambah">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Foto Pertama
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}
        </div>
    );
}
