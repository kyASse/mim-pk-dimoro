"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Initialize Supabase client
const supabase = createClient();

// Define the type for achievement data
interface PrestasiData {
    id: number;
    nama_prestasi: string;
    jenis_prestasi: string;
    tanggal: string;
    deskripsi?: string;
    created_at: string;
}

export default function PrestasiPage() {
    const [prestasiList, setPrestasiList] = useState<PrestasiData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrestasi = async () => {
            try {
                const { data, error } = await supabase
                    .from('prestasi')  // Adjust table name if different
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setPrestasiList(data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch prestasi data');
            } finally {
                setLoading(false);
            }
        };

        fetchPrestasi();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    <p className="text-lg font-medium">Error:</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Data Prestasi Akademik</h1>
                <Link 
                    href="/admin/akademik/prestasi/tambah"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Tambah Prestasi
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium">Daftar Prestasi</h2>
                </div>
                
                <div className="overflow-x-auto">
                    {prestasiList.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">Tidak ada data prestasi</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Prestasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prestasiList.map((prestasi, index) => (
                                    <tr key={prestasi.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prestasi.nama_prestasi}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prestasi.jenis_prestasi}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(prestasi.tanggal).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex space-x-2">
                                                <Link 
                                                    href={`/admin/akademik/prestasi/detail/${prestasi.id}`}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                                >
                                                    Detail
                                                </Link>
                                                <Link 
                                                    href={`/admin/akademik/prestasi/edit/${prestasi.id}`}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                    onClick={() => {
                                                        if (confirm("Anda yakin ingin menghapus prestasi ini?")) {
                                                            // Delete logic would go here
                                                            console.log("Delete item", prestasi.id);
                                                        }
                                                    }}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}