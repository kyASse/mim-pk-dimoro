'use client';

import { deleteTestimoniAction } from './actions';
import { useTransition } from 'react';
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function DeleteTestimoniButton({ testimoniId }: { testimoniId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const result = await deleteTestimoniAction(testimoniId);
                if (result.success) {
                    toast.success("Testimoni berhasil dihapus!", {
                        description: "Data testimoni telah dihapus dari sistem.",
                    });
                } else {
                    toast.error("Gagal menghapus testimoni", {
                        description: result.message,
                    });
                }
            } catch (error) {
                console.error("Error deleting testimoni:", error);
                toast.error("Terjadi kesalahan", {
                    description: error instanceof Error ? error.message : "Gagal menghapus testimoni. Silakan coba lagi.",
                });
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-border/80"
                    disabled={isPending}
                    aria-label="Hapus Testimoni"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border text-foreground">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Konfirmasi Hapus Testimoni
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Apakah Anda yakin ingin menghapus testimoni ini? Tindakan ini tidak dapat dibatalkan 
                        dan data testimoni akan dihapus secara permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        disabled={isPending}
                        className="border-border/80 hover:bg-muted text-foreground"
                    >
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus Testimoni
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
