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
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <Trash2 className="w-3 h-3" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Konfirmasi Hapus Testimoni
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus testimoni ini? Tindakan ini tidak dapat dibatalkan 
                        dan data testimoni akan dihapus secara permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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