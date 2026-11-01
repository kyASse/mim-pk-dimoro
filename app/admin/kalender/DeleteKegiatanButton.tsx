// app/admin/kalender/DeleteKegiatanButton.tsx
'use client';

import { deleteKegiatanAction } from './actions';
import { useTransition, useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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

type DeleteKegiatanButtonProps = {
    kegiatanId: number;
    judulKegiatan?: string;
};

export default function DeleteKegiatanButton({ kegiatanId, judulKegiatan }: DeleteKegiatanButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const result = await deleteKegiatanAction(kegiatanId);
                if (result?.success !== false) {
                    toast.success('Kegiatan berhasil dihapus!');
                    setOpen(false);
                } else {
                    toast.error(result?.message || 'Gagal menghapus kegiatan');
                }
            } catch (error) {
                console.error('Error deleting kegiatan:', error);
                toast.error('Terjadi kesalahan saat menghapus kegiatan');
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-border/80 text-muted-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive dark:hover:bg-destructive/20 dark:hover:text-destructive-foreground transition-colors"
                    disabled={isPending}
                    aria-label={`Hapus kegiatan ${judulKegiatan || ''}`}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                    ) : (
                        <Trash2 className="h-4 w-4 text-destructive/80" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-xl">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-lg font-semibold text-foreground">
                                Konfirmasi Hapus Kegiatan
                            </AlertDialogTitle>
                        </div>
                    </div>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Apakah Anda yakin ingin menghapus kegiatan {judulKegiatan ? <strong className="text-foreground font-semibold">"{judulKegiatan}"</strong> : "ini"} secara permanen? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={isPending} className="border-border text-foreground hover:bg-muted">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            'Hapus Kegiatan'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
