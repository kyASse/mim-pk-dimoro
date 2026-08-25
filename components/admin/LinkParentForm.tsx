"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import LinkParentModal from "@/components/admin/siswa/LinkParentModal";

export default function LinkParentForm({
  siswaId,
  namaSiswa = "Siswa",
  profileOrangTuaId = null,
}: {
  siswaId: string;
  namaSiswa?: string;
  profileOrangTuaId?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 text-xs h-8"
      >
        <LinkIcon className="h-3.5 w-3.5" />
        Kelola Akun Wali
      </Button>

      <LinkParentModal
        siswa={{
          id: siswaId,
          nama_lengkap: namaSiswa,
          profile_orang_tua_id: profileOrangTuaId,
        }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
