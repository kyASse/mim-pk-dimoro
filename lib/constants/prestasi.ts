/**
 * Constants & helper styling untuk modul Prestasi Akademik & Non-Akademik
 * MIM PK Dimoro. Menyediakan opsi tingkat dan token tema gelap semantik.
 */

export type TingkatPrestasi =
    | 'Internasional'
    | 'Nasional'
    | 'Provinsi'
    | 'Kabupaten'
    | 'Kecamatan'
    | 'Internal'
    | string;

export interface TingkatOption {
    value: string;
    label: string;
    description?: string;
}

export const TINGKAT_PRESTASI_OPTIONS: TingkatOption[] = [
    { value: 'Internasional', label: 'Internasional', description: 'Tingkat antar negara' },
    { value: 'Nasional', label: 'Nasional', description: 'Tingkat seluruh Indonesia' },
    { value: 'Provinsi', label: 'Provinsi', description: 'Tingkat D.I. Yogyakarta / Jawa Tengah' },
    { value: 'Kabupaten', label: 'Kabupaten', description: 'Tingkat Kabupaten / Kota' },
    { value: 'Kecamatan', label: 'Kecamatan', description: 'Tingkat Kapanewon / Kecamatan' },
    { value: 'Internal', label: 'Internal Madrasah', description: 'Tingkat sekolah / antarkelas' },
];

export interface TingkatBadgeStyle {
    bg: string;
    text: string;
    border: string;
    dot: string;
    combined: string;
}

export const TINGKAT_BADGE_CONFIGS: Record<string, TingkatBadgeStyle> = {
    Internasional: {
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800/60',
        dot: 'bg-purple-500',
        combined: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    },
    Nasional: {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
        combined: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    },
    Provinsi: {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
        dot: 'bg-blue-500',
        combined: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    },
    Kabupaten: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
        combined: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    Kecamatan: {
        bg: 'bg-slate-50 dark:bg-slate-800/40',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700/60',
        dot: 'bg-slate-500',
        combined: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/60',
    },
    Internal: {
        bg: 'bg-zinc-50 dark:bg-zinc-800/40',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-200 dark:border-zinc-700/60',
        dot: 'bg-zinc-500',
        combined: 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-700/60',
    },
};

const DEFAULT_TINGKAT_STYLE: TingkatBadgeStyle = {
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700/60',
    dot: 'bg-slate-500',
    combined: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/60',
};

/**
 * Mendapatkan kombinasi kelas Tailwind untuk badge tingkat dengan dukungan Dark Mode.
 */
export function getTingkatBadgeClasses(tingkat?: string | null): TingkatBadgeStyle {
    if (!tingkat) return DEFAULT_TINGKAT_STYLE;

    // Normalisasi case-insensitive & trim
    const normalized = tingkat.trim();
    const matchKey = Object.keys(TINGKAT_BADGE_CONFIGS).find(
        k => k.toLowerCase() === normalized.toLowerCase()
    );

    if (matchKey && TINGKAT_BADGE_CONFIGS[matchKey]) {
        return TINGKAT_BADGE_CONFIGS[matchKey];
    }

    return DEFAULT_TINGKAT_STYLE;
}
