'use client';

import { useTransition } from 'react';
import { deleteGaleriAction } from './actions';
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
    AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
    galeriId: number;
    imageUrl: string;
};

export default function DeleteImageButton({ galeriId, imageUrl }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                const result = await deleteGaleriAction(galeriId, imageUrl);
                if (result.success) {
                    toast.success("Berhasil!", {
                        description: "Gambar berhasil dihapus dari galeri",
                    });
                } else {
                    toast.error("Gagal menghapus gambar", {
                        description: result.message || "Terjadi kesalahan saat menghapus gambar",
                    });
                }
            } catch {
                toast.error("Terjadi kesalahan", {
                    description: "Silakan coba lagi atau hubungi administrator",
                });
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isPending}
                    className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Menghapus...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Hapus
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="bg-card border-border text-foreground">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Hapus Gambar?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-sm">
                        Apakah Anda yakin ingin menghapus gambar ini dari galeri? 
                        Tindakan ini tidak dapat dibatalkan dan file akan dihapus permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-border">Batal</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            "Ya, Hapus"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
