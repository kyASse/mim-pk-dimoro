#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// ANSI escape codes for clean terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
};

const DEFAULT_LOCAL_TEMPLATE = `# Kredensial Supabase Lokal (Docker / Supabase CLI)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

const DEFAULT_REMOTE_TEMPLATE = `# Kredensial Supabase Remote (Supabase Cloud)
# Ambil dari: Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-remote-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-remote-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

/**
 * Parse target argument to canonical form: 'local' | 'remote' | 'status' | null
 */
export function parseTarget(arg) {
  if (!arg || arg.trim() === '' || arg.toLowerCase() === 'status' || arg.toLowerCase() === 's') {
    return 'status';
  }
  const clean = arg.trim().toLowerCase();
  if (['local', 'l', 'dev', 'development'].includes(clean)) {
    return 'local';
  }
  if (['remote', 'r', 'prod', 'production', 'cloud'].includes(clean)) {
    return 'remote';
  }
  return null;
}

/**
 * Detect target type and Supabase URL from .env file content
 */
export function detectTargetFromContent(content) {
  if (!content) {
    return { type: 'unknown', url: null };
  }
  const match = content.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*([^\r\n#]+)/m);
  if (!match) {
    return { type: 'unknown', url: null };
  }
  const url = match[1].trim();
  if (url.includes('127.0.0.1') || url.includes('localhost')) {
    return { type: 'local', url };
  }
  if (url.includes('supabase.co') || url.startsWith('https://')) {
    return { type: 'remote', url };
  }
  return { type: 'unknown', url };
}

/**
 * Get filename for given profile target
 */
export function getProfileFileName(target) {
  if (target === 'local') return '.env.local.supabase-local';
  if (target === 'remote') return '.env.local.supabase-remote';
  return null;
}

/**
 * Ensure profile exists, creating starter default template if missing
 */
export function ensureProfileExists(profilePath, target) {
  if (!fs.existsSync(profilePath)) {
    const template = target === 'local' ? DEFAULT_LOCAL_TEMPLATE : DEFAULT_REMOTE_TEMPLATE;
    fs.writeFileSync(profilePath, template, 'utf-8');
    return true; // created
  }
  return false; // already existed
}

/**
 * Switch active environment by copying profile to .env.local
 */
export function switchEnv(target, rootDir = process.cwd()) {
  if (target !== 'local' && target !== 'remote') {
    throw new Error(`Target tidak valid: ${target}. Gunakan 'local' atau 'remote'.`);
  }

  const profileFileName = getProfileFileName(target);
  const profilePath = path.join(rootDir, profileFileName);
  const destPath = path.join(rootDir, '.env.local');

  const created = ensureProfileExists(profilePath, target);
  fs.copyFileSync(profilePath, destPath);

  const newContent = fs.readFileSync(destPath, 'utf-8');
  const detected = detectTargetFromContent(newContent);

  return {
    success: true,
    target,
    url: detected.url,
    profileFileName,
    wasCreated: created,
  };
}

/**
 * Get current active environment status from .env.local
 */
export function getStatus(rootDir = process.cwd()) {
  const envLocalPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envLocalPath)) {
    return {
      exists: false,
      target: 'unknown',
      url: null,
    };
  }

  const content = fs.readFileSync(envLocalPath, 'utf-8');
  const detected = detectTargetFromContent(content);

  return {
    exists: true,
    target: detected.type,
    url: detected.url,
  };
}

// CLI entry point
function runCLI() {
  const arg = process.argv[2];
  const target = parseTarget(arg);

  if (!target) {
    console.error(
      `${colors.red}${colors.bold}[ERROR]${colors.reset} Target '${arg}' tidak valid.`
    );
    console.log(`Gunakan salah satu dari pilihan berikut:`);
    console.log(`  ${colors.cyan}npm run env:local${colors.reset}   -> Beralih ke Supabase Local (Docker)`);
    console.log(`  ${colors.cyan}npm run env:remote${colors.reset}  -> Beralih ke Supabase Remote (Cloud)`);
    console.log(`  ${colors.cyan}npm run env:status${colors.reset}  -> Cek target Supabase yang aktif`);
    process.exit(1);
  }

  const rootDir = process.cwd();

  if (target === 'status') {
    const status = getStatus(rootDir);
    console.log(`\n${colors.bold}=== STATUS SUPABASE ENVIRONMENT ===${colors.reset}`);
    if (!status.exists) {
      console.log(`${colors.yellow}[PERINGATAN] File .env.local belum ditemukan.${colors.reset}`);
      console.log(`Jalankan salah satu perintah untuk menginisialisasi:`);
      console.log(`  ${colors.cyan}npm run env:local${colors.reset}  atau  ${colors.cyan}npm run env:remote${colors.reset}\n`);
      return;
    }

    const badge =
      status.target === 'local'
        ? `${colors.green}${colors.bold}[LOCAL]${colors.reset}`
        : status.target === 'remote'
        ? `${colors.magenta}${colors.bold}[REMOTE CLOUD]${colors.reset}`
        : `${colors.yellow}${colors.bold}[UNKNOWN]${colors.reset}`;

    console.log(`Target Aktif : ${badge}`);
    console.log(`Endpoint URL : ${colors.cyan}${status.url || 'Tidak terdeteksi'}${colors.reset}`);
    console.log(`File Sumber  : .env.local\n`);
    return;
  }

  // Handle 'local' or 'remote' switch
  try {
    const result = switchEnv(target, rootDir);
    const label = target.toUpperCase();
    const colorTag = target === 'local' ? colors.green : colors.magenta;

    console.log(`\n${colorTag}${colors.bold}[BERHASIL]${colors.reset} Berhasil beralih ke Supabase: ${colorTag}${colors.bold}${label}${colors.reset}`);
    console.log(`Endpoint URL : ${colors.cyan}${result.url || 'Tidak terdeteksi'}${colors.reset}`);
    console.log(`Disalin dari : ${colors.gray}${result.profileFileName}${colors.reset} -> ${colors.bold}.env.local${colors.reset}`);

    if (result.wasCreated) {
      console.log(`${colors.yellow}[INFO] File profil ${result.profileFileName} baru saja dibuat secara otomatis.${colors.reset}`);
    }

    console.log(`\n${colors.yellow}${colors.bold}[PENTING]${colors.reset} Silakan restart development server (${colors.cyan}npm run dev${colors.reset}) jika sedang berjalan agar variabel termuat ulang.\n`);
  } catch (err) {
    console.error(`${colors.red}${colors.bold}[GAGAL]${colors.reset} Terjadi kesalahan: ${err.message}`);
    process.exit(1);
  }
}

// Only invoke runCLI if executed directly from terminal
const isDirectExecution =
  process.argv[1] &&
  (process.argv[1].endsWith('switch-env.mjs') || process.argv[1].endsWith('switch-env'));

if (isDirectExecution) {
  runCLI();
}
