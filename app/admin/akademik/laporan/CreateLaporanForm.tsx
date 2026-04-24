"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLaporanAction } from "./actions";

type Siswa = { id: number; nama_lengkap: string };

export default function CreateLaporanForm({ siswa }: { siswa: Siswa[] }) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [state, formAction] = useActionState(createLaporanAction, { success: false, message: "" });

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/akademik/laporan?status=ok");
    } else if (state?.message) {
      setErrorMsg(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2">
        <Label htmlFor="siswa_id">Siswa</Label>
        <select id="siswa_id" name="siswa_id" className="w-full border rounded h-10 px-3" required>
          <option value="">Pilih siswa</option>
          {siswa.map((s) => (
            <option key={s.id} value={s.id}>{s.nama_lengkap}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="semester">Semester</Label>
        <Input id="semester" name="semester" placeholder="Ganjil/Genap" required />
      </div>
      <div>
        <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
        <Input id="tahun_ajaran" name="tahun_ajaran" placeholder="2025/2026" required />
      </div>
      <div className="md:col-span-5">
        <Label htmlFor="catatan_guru">Catatan Guru</Label>
        <Input id="catatan_guru" name="catatan_guru" placeholder="Opsional" />
      </div>
      <div className="md:col-span-3">
        <Label htmlFor="rapor">Unggah Rapor (PDF)</Label>
        <Input id="rapor" name="rapor" type="file" accept="application/pdf" required />
      </div>
      {errorMsg && (
        <div className="md:col-span-5 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{errorMsg}</div>
      )}
      <div className="flex items-end">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
