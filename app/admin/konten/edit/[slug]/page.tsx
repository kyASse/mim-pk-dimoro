"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, FileText, Calendar, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Component to render JSON data in a readable format
function JSONRenderer({ data }: { data: string }) {
    try {
        const parsedData = JSON.parse(data);
        return (
            <div className="space-y-2">
                {Object.entries(parsedData).map(([key, value]) => (
                    <div key={key} className="flex">
                        <span className="font-semibold text-blue-700 min-w-0 mr-2">{key}:</span>
                        <span className="text-gray-600 break-all">
                            {typeof value === 'object' 
                                ? JSON.stringify(value, null, 2) 
                                : String(value)
                            }
                        </span>
                    </div>
                ))}
            </div>
        );
    } catch {
        return <span className="text-red-500 italic">Invalid JSON</span>;
    }
}

type EditPageProps = { params: Promise<{ slug: string }> };

interface KontenItem {
    id: number;
    slug: string;
    judul: string | null;
    isi: Record<string, unknown> | null; // JSONB field - can be any JSON structure
    created_at: string;
    updated_at: string;
}

export default function EditKontenPage({ params }: EditPageProps) {
    const [konten, setKonten] = useState<KontenItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [jsonError, setJsonError] = useState<string>('');
    const [formData, setFormData] = useState({
        judul: '',
        isi: '' // This will hold JSON string representation
    });
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchKonten() {
            const { slug } = await params;
            const { data, error } = await supabase
                .from('konten_halaman')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                toast.error('Konten tidak ditemukan');
                router.push('/admin/konten');
                return;
            }

            setKonten(data);
            setFormData({
                judul: data.judul || '',
                isi: data.isi ? JSON.stringify(data.isi, null, 2) : ''
            });
            setIsLoading(false);
        }

        fetchKonten();
    }, [params, router, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!konten) return;

        setIsSaving(true);

        try {
            // Parse JSON from string
            let isiData: Record<string, unknown> | null = null;
            if (formData.isi.trim()) {
                try {
                    isiData = JSON.parse(formData.isi);
                    setJsonError('');
                } catch {
                    setJsonError('Format JSON tidak valid. Silakan periksa syntax JSON Anda.');
                    setIsSaving(false);
                    return;
                }
            }

            const { error } = await supabase
                .from('konten_halaman')
                .update({
                    judul: formData.judul,
                    isi: isiData,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', konten.slug);

            if (error) throw error;

            toast.success('Konten berhasil diperbarui!');
            router.push('/admin/konten');
        } catch (error) {
            console.error('Error updating konten:', error);
            toast.error('Gagal memperbarui konten. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validate JSON in real-time for 'isi' field
        if (field === 'isi') {
            if (value.trim() === '') {
                setJsonError('');
                return;
            }
            
            try {
                JSON.parse(value);
                setJsonError('');
            } catch {
                setJsonError('Format JSON tidak valid');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Memuat konten...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!konten) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href="/admin/konten">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <Badge variant="secondary">
                                <FileText className="w-3 h-3 mr-1" />
                                {konten.slug}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Konten</h1>
                        <p className="text-gray-600">Perbarui konten halaman website</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Form Edit Konten
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="judul">Judul Konten</Label>
                                    <Input
                                        id="judul"
                                        name="judul"
                                        type="text"
                                        value={formData.judul}
                                        onChange={(e) => handleInputChange('judul', e.target.value)}
                                        placeholder="Masukkan judul konten"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="isi">Isi Konten (JSON Format)</Label>
                                    <p className="text-sm text-gray-500">
                                        Data ini disimpan dalam format JSON. Pastikan format JSON valid sebelum menyimpan.
                                    </p>
                                    {jsonError && (
                                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2">
                                            <span className="text-red-500">⚠️</span>
                                            {jsonError}
                                        </div>
                                    )}
                                    <Textarea
                                        id="isi"
                                        name="isi"
                                        value={formData.isi}
                                        onChange={(e) => handleInputChange('isi', e.target.value)}
                                        placeholder='{"key": "value"}'
                                        rows={20}
                                        className={`font-mono text-sm ${jsonError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        required
                                    />
                                    <div className="text-xs text-gray-400">
                                        💡 Tips: Gunakan indentasi yang proper untuk JSON yang mudah dibaca
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Terakhir diperbarui: {new Date(konten.updated_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={isSaving || Boolean(jsonError)} 
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    {showPreview && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Preview Konten
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {formData.judul || 'Judul konten akan muncul di sini'}
                                        </h2>
                                    </div>
                                    
                                    {/* JSON Preview */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-700">Data JSON:</h3>
                                        {formData.isi ? (
                                            <div>
                                                {jsonError ? (
                                                    <div className="bg-red-50 border border-red-200 rounded p-4">
                                                        <p className="text-red-600 text-sm">❌ JSON tidak valid</p>
                                                        <pre className="text-red-500 text-xs mt-2 overflow-x-auto">
                                                            {formData.isi}
                                                        </pre>
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-50 border rounded p-4">
                                                        <p className="text-green-600 text-sm mb-2">✅ JSON valid</p>
                                                        <pre className="text-gray-700 text-sm overflow-x-auto">
                                                            {(() => {
                                                                try {
                                                                    const parsed = JSON.parse(formData.isi);
                                                                    return JSON.stringify(parsed, null, 2);
                                                                } catch {
                                                                    return formData.isi;
                                                                }
                                                            })()}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 border rounded p-4">
                                                <p className="text-gray-500 italic text-sm">Data JSON akan muncul di sini</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Rendered Preview (if applicable) */}
                                    {formData.isi && !jsonError && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-gray-700">Struktur Data:</h3>
                                            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                                <JSONRenderer data={formData.isi} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}