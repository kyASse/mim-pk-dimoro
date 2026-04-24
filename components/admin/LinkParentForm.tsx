"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { linkOrCreateParentAccountAction } from "@/app/admin/siswa/actions";

export default function LinkParentForm({ siswaId }: { siswaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formEl = e.currentTarget as HTMLFormElement;
      const formData = new FormData(formEl);
      const res = await linkOrCreateParentAccountAction(siswaId, formData);
      if (res?.success) {
        toast.success("Akun orang tua berhasil dibuat/dihubungkan");
        router.refresh();
        formEl.reset();
      } else {
        toast.error(res?.message || "Gagal membuat/menghubungkan akun orang tua");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan tak terduga");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor={`email-${siswaId}`}>Email Orang Tua</Label>
        <Input id={`email-${siswaId}`} name="email" type="email" placeholder="parent@mail.com" required />
      </div>
      <div className="self-end">
        <Button type="submit" disabled={loading}>{loading ? "Memproses…" : "Hubungkan/Buat Akun"}</Button>
      </div>
    </form>
  );
}
