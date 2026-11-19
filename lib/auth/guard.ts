import { createClient } from "@/lib/supabase/server";
import { ADMIN_ROLES, type UserRole } from "@/lib/auth/types";

export type AuthContext = {
  user: { id: string; email?: string };
  role: UserRole;
  profile: { id: string; role: UserRole; nama_lengkap: string | null };
};

export async function requireAuthenticatedUser(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("UNAUTHORIZED: Session invalid or expired");
  }

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("id, role, nama_lengkap")
    .eq("id", user.id)
    .single();

  if (pErr || !profile) {
    throw new Error("UNAUTHORIZED: User profile not found");
  }

  return {
    user: { id: user.id, email: user.email },
    role: profile.role as UserRole,
    profile: profile as AuthContext["profile"],
  };
}

export async function requireAdminSession(
  allowedRoles: UserRole[] = ADMIN_ROLES
): Promise<AuthContext> {
  const ctx = await requireAuthenticatedUser();
  if (!allowedRoles.includes(ctx.role)) {
    throw new Error(`FORBIDDEN: Role '${ctx.role}' does not possess required administrative privileges`);
  }
  return ctx;
}
