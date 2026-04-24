'use client';

import { deleteBeritaAction } from './actions';
import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type DeleteButtonProps = {
    beritaId: number;
    imageUrl: string;
};

export default function DeleteButton({ beritaId, imageUrl }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        toast.custom((t) => (
            <div className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Konfirmasi Hapus</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Apakah Anda yakin ingin menghapus berita ini secara permanen? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.dismiss(t)}
                        className="h-8"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            toast.dismiss(t);
                            startTransition(async () => {
                                try {
                                    const result = await deleteBeritaAction(beritaId, imageUrl);
                                    if (result.success) {
                                        toast.success('Berita berhasil dihapus!');
                                    } else {
                                        toast.error(result.message || 'Gagal menghapus berita');
                                    }
                                } catch (error) {
                                    console.error('Error deleting news:', error);
                                    toast.error('Terjadi kesalahan saat menghapus berita');
                                }
                            });
                        }}
                        disabled={isPending}
                        className="h-8"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            'Hapus'
                        )}
                    </Button>
                </div>
            </div>
        ), {
            duration: Infinity, // Keep toast open until user responds
            position: 'top-center',
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4 text-red-600" />
            )}
        </Button>
    );
}