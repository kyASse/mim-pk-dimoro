'use client';

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
import { UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { acceptAndCreatePortalAccountAction } from '../../actions';

type PendaftarData = {
    id: string;
    nama_lengkap: string | null;
    email: string | null;
};

type Props = {
    pendaftar: PendaftarData;
};

export default function ProcessRegistrationButton({ pendaftar }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleProcess = async () => {
        startTransition(async () => {
            try {
                const result = await acceptAndCreatePortalAccountAction(pendaftar);
                if (!result.success) {
                    toast.error("Proses Gagal", {
                        description: result.message,
                        duration: 5000
                    });
                } else {
                    toast.success("Berhasil!", {
                        description: result.message,
                        duration: 5000
                    });
                }
            } catch (error) {
                toast.error("Terjadi kesalahan", {
                    description: "Silakan coba lagi atau hubungi administrator",
                    duration: 5000
                });
                console.error('Process registration error:', error);
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    disabled={isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="default"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Terima & Buatkan Akun Portal
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Penerimaan Pendaftar</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda akan <strong>MENERIMA</strong> pendaftar <strong>{pendaftar.nama_lengkap}</strong> dan 
                        <strong> MEMBUAT AKUN PORTAL</strong> untuk email <strong>{pendaftar.email}</strong>.
                        <br /><br />
                        Tindakan ini akan mengirim email berisi informasi akun portal ke pendaftar. 
                        Apakah Anda yakin ingin melanjutkan?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleProcess}
                        disabled={isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Ya, Proses Sekarang
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}