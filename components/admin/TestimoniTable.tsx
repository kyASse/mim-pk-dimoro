"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Check, X, Search, Eye } from "lucide-react";
import TestimonialCard from "@/components/home/TestimonialCard";
import DeleteTestimoniButton from "@/app/admin/testimoni/DeleteTestimoniButton";

type TestimoniItem = {
    id: number;
    nama_orang_tua: string | null;
    status_orang_tua: string | null;
    is_featured: boolean | null;
    isi_testimoni: string | null;
    created_at: string;
};

interface TestimoniTableProps {
    testimoni: TestimoniItem[];
}

export default function TestimoniTable({ testimoni }: TestimoniTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("semua");
    const [selectedTestimoni, setSelectedTestimoni] = useState<TestimoniItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filter dan search testimoni
    const filteredTestimoni = useMemo(() => {
        let filtered = testimoni;

        // Filter berdasarkan tab
        if (activeTab === "featured") {
            filtered = filtered.filter(t => t.is_featured);
        } else if (activeTab === "regular") {
            filtered = filtered.filter(t => !t.is_featured);
        }

        // Filter berdasarkan search query
        if (searchQuery) {
            filtered = filtered.filter(t => 
                t.nama_orang_tua?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.status_orang_tua?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.isi_testimoni?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [testimoni, searchQuery, activeTab]);

    const handleViewTestimoni = (item: TestimoniItem) => {
        setSelectedTestimoni(item);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama orang tua, status, atau isi testimoni..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Tabs untuk filtering */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="semua">Semua ({testimoni.length})</TabsTrigger>
                    <TabsTrigger value="featured">
                        Ditampilkan ({testimoni.filter(t => t.is_featured).length})
                    </TabsTrigger>
                    <TabsTrigger value="regular">
                        Tidak Ditampilkan ({testimoni.filter(t => !t.is_featured).length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filteredTestimoni.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Orang Tua</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Isi Testimoni</TableHead>
                                    <TableHead className="text-center">Ditampilkan</TableHead>
                                    <TableHead>Tanggal Dibuat</TableHead>
                                    <TableHead className="w-[140px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTestimoni.map((item: TestimoniItem) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.nama_orang_tua || 'Nama tidak tersedia'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {item.status_orang_tua || 'Status tidak tersedia'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <p className="truncate text-sm text-gray-600">
                                                {item.isi_testimoni || 'Testimoni tidak tersedia'}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.is_featured ? (
                                                <Badge variant="default" className="bg-green-100 text-green-800">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Ya
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                    <X className="w-3 h-3 mr-1" />
                                                    Tidak
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/testimoni/edit/${item.id}`}>
                                                        <Edit className="w-3 h-3" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleViewTestimoni(item)}
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                                <DeleteTestimoniButton testimoniId={item.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <div className="bg-gray-50 rounded-lg p-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada testimoni'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchQuery 
                                        ? `Tidak ditemukan testimoni yang cocok dengan "${searchQuery}"`
                                        : 'Belum ada testimoni dalam kategori ini.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Dialog Preview Testimoni */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Preview Testimoni</DialogTitle>
                    </DialogHeader>
                    {selectedTestimoni && (
                        <div className="mt-4">
                            <TestimonialCard
                                name={selectedTestimoni.nama_orang_tua || 'Nama tidak tersedia'}
                                role={selectedTestimoni.status_orang_tua || 'Status tidak tersedia'}
                                testimonial={selectedTestimoni.isi_testimoni || 'Testimoni tidak tersedia'}
                                avatarUrl={undefined} // Tidak ada avatar di database testimoni
                            />
                            <div className="mt-4 text-center">
                                <div className="text-xs text-gray-500">
                                    Dibuat: {new Date(selectedTestimoni.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="mt-2">
                                    <Badge variant={selectedTestimoni.is_featured ? "default" : "secondary"} className="text-xs">
                                        {selectedTestimoni.is_featured ? 'Tampil di Beranda' : 'Tidak Ditampilkan'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
