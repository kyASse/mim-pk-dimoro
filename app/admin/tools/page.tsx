import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Wrench, Sparkles, UserCheck } from "lucide-react";
import { createStaticParentRendieAction } from "./actions";
import { AdminUnderDevelopment } from "@/components/admin/AdminUnderDevelopment";
import { Button } from "@/components/ui/button";

export default async function AdminToolsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return redirect("/");

  async function runCreate(formData: FormData) {
    "use server";
    await createStaticParentRendieAction(null as any, formData);
  }

  return (
    <AdminUnderDevelopment
      title="Generator Akun & Admin Tools"
      description="Pusat utilitas pengembang, generator akun simulasi portal madrasah, dan inspeksi integritas sistem."
      category="Komunikasi & Pengaturan"
      status="in_development"
      progress={75}
      estimatedRelease="April 2026"
      icon="wrench"
      plannedFeatures={[
        {
          title: "Generator Akun Simulasi Wali",
          description: "Pembuatan otomatis kredensial wali murid untuk pengujian portal orang tua.",
          status: "completed",
          tags: ["Auth", "Testing"],
        },
        {
          title: "Audit Log & Security Inspector",
          description: "Monitoring pencatatan aktivitas login, modifikasi data, dan rollback keamanan.",
          status: "in_progress",
          tags: ["Security", "RLS"],
        },
        {
          title: "Sinkronisasi Data EMIS Kemenag",
          description: "Integrasi format berkas baku Kementerian Agama untuk pelaporan tahunan.",
          status: "planned",
          tags: ["EMIS", "Kemenag"],
        },
        {
          title: "Backup & Export Database Terjadwal",
          description: "Ekspor terenkripsi berkas snapshot PostgreSQL secara otomatis.",
          status: "planned",
          tags: ["Database", "Backup"],
        },
      ]}
      technicalNotes={[
        "Integrasi Supabase Auth Admin API dengan token service role terisolasi",
        "Enkripsi password dan pembersihan akun testing secara berkala",
        "Pencatatan riwayat perubahan data pada tabel audit_logs",
      ]}
    >
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-foreground font-semibold text-sm sm:text-base">
          <UserCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
          <span>Utilitas Pengujian Portal Wali Murid</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Gunakan tombol di bawah ini untuk membuat akun wali murid statis (*Rendie*) pada database lokal/staging guna menguji alur verifikasi berkas dan notifikasi portal.
        </p>

        <form action={runCreate} className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            type="submit"
            className="h-10 text-sm gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-xs"
          >
            <Sparkles className="size-4" />
            <span>Buat / Reset Akun Orang Tua (Rendie)</span>
          </Button>
        </form>

        <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Default Email:</strong> <code className="text-foreground">orangtua.rendie@example.com</code>
          </p>
          <p>
            <strong>Default Password:</strong> <code className="text-foreground">RendieTest123!</code>
          </p>
        </div>
      </div>
    </AdminUnderDevelopment>
  );
}
