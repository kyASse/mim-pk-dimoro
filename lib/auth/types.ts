export type UserRole =
  | 'super_admin'
  | 'admin_tu'
  | 'kepala_madrasah'
  | 'bendahara'
  | 'wali_kelas'
  | 'guru_mapel'
  | 'orang_tua'
  | 'admin';

export const ADMIN_ROLES: UserRole[] = [
  'super_admin',
  'admin_tu',
  'kepala_madrasah',
  'bendahara',
  'wali_kelas',
  'guru_mapel',
  'admin',
];

export const SUPER_ADMIN_ROLES: UserRole[] = [
  'super_admin',
  'admin',
];

export interface UserProfile {
  id: string;
  role: UserRole;
  nama_lengkap: string | null;
  created_at: string;
}

export interface AuditLogEntry {
  id?: string;
  user_id?: string | null;
  table_name: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'CUSTOM';
  record_id?: string | null;
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at?: string;
}
