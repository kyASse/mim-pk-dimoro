'use client';

import { useState, useTransition } from 'react';
import { deletePrestasiAction } from '@/app/admin/akademik/actions';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeletePrestasiDialogProps {
    prestasiId: number;
    prestasiNama?: string | null;
    namaSiswa?: string | null;
    onDeleted?: (id: number) => void;
}

export default function DeletePrestasiDialog({
    prestasiId,
    prestasiNama,
    namaSiswa,
    onDeleted,
}: DeletePrestasiDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const res = await deletePrestasiAction(prestasiId);
                if (res?.success) {
                    toast.success('Data prestasi berhasil dihapus');
                    setOpen(false);
                    onDeleted?.(prestasiId);
                } else {
                    toast.error(res?.message || 'Gagal menghapus prestasi');
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Terjadi kesalahan saat menghapus data');
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    data-testid={`delete-btn-${prestasiId}`}
                    aria-label={`Hapus prestasi ${prestasiNama || ''}`}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 border-border"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border text-card-foreground sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Hapus Data Prestasi?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Apakah Anda yakin ingin menghapus catatan prestasi{' '}
                        <strong className="text-foreground font-semibold">
                            {prestasiNama || 'ini'}
                        </strong>
                        {namaSiswa ? ` atas nama ${namaSiswa}` : ''}? Tindakan ini bersifat permanen dan berkas dokumentasi di storage akan dihapus.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel
                        disabled={isPending}
                        className="border-border hover:bg-muted text-foreground"
                    >
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus Prestasi
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
