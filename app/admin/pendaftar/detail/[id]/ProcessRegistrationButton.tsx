"use client";

import { useTransition } from "react";
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
import { acceptAndCreatePortalAccountAction } from "../../actions";

type PendaftarData = {
  id: string;
  nama_lengkap: string | null;
  email: string | null;
};

type Props = {
  pendaftar: PendaftarData;
  className?: string;
};

export default function ProcessRegistrationButton({ pendaftar, className }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleProcess = async () => {
    startTransition(async () => {
      try {
        const result = await acceptAndCreatePortalAccountAction(pendaftar);
        if (!result.success) {
          toast.error("Proses Penerimaan Gagal", {
            description: result.message,
            duration: 5000,
          });
        } else {
          toast.success("Berhasil Menerima Siswa!", {
            description: result.message,
            duration: 5000,
          });
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem", {
          description: "Silakan coba lagi atau hubungi tim teknis.",
          duration: 5000,
        });
        console.error("Process registration error:", error);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isPending}
          className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 shadow-sm transition-all active:scale-[0.98] ${
            className || ""
          }`}
          size="sm"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Memproses Penerimaan...
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              Terima & Buatkan Akun Portal
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold">
            Konfirmasi Penerimaan Siswa
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Anda akan mengubah status calon siswa{" "}
            <strong className="text-foreground font-semibold">
              {pendaftar.nama_lengkap || "Tanpa Nama"}
            </strong>{" "}
            menjadi <strong className="text-emerald-600 font-semibold">Diterima</strong>{" "}
            serta otomatis menerbitkan akun Portal Wali Murid ke email:
            <span className="block mt-2 font-mono p-2 rounded-md bg-muted text-foreground text-center">
              {pendaftar.email || "Email belum terdaftar"}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={isPending} className="text-xs">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleProcess}
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Memproses...
              </>
            ) : (
              "Ya, Proses & Terbitkan Akun"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}