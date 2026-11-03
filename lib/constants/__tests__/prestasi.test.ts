import { describe, it, expect } from 'vitest';
import {
    TINGKAT_PRESTASI_OPTIONS,
    getTingkatBadgeClasses,
    type TingkatPrestasi,
} from '../prestasi';

describe('prestasi constants and helpers', () => {
    it('defines standard tingkat options in logical hierarchical order', () => {
        expect(TINGKAT_PRESTASI_OPTIONS.length).toBeGreaterThanOrEqual(5);
        const values = TINGKAT_PRESTASI_OPTIONS.map(opt => opt.value);
        expect(values).toContain('Internasional');
        expect(values).toContain('Nasional');
        expect(values).toContain('Provinsi');
        expect(values).toContain('Kabupaten');
        expect(values).toContain('Kecamatan');
    });

    it('returns purple theme classes with dark mode support for Internasional', () => {
        const classes = getTingkatBadgeClasses('Internasional');
        expect(classes.combined).toContain('text-purple-700');
        expect(classes.combined).toContain('dark:text-purple-300');
        expect(classes.combined).toContain('dark:bg-purple-950/40');
        expect(classes.dot).toContain('bg-purple-500');
    });

    it('returns amber/gold theme classes with dark mode support for Nasional', () => {
        const classes = getTingkatBadgeClasses('Nasional');
        expect(classes.combined).toContain('text-amber-700');
        expect(classes.combined).toContain('dark:text-amber-300');
        expect(classes.combined).toContain('dark:bg-amber-950/40');
        expect(classes.dot).toContain('bg-amber-500');
    });

    it('returns blue theme classes with dark mode support for Provinsi', () => {
        const classes = getTingkatBadgeClasses('Provinsi');
        expect(classes.combined).toContain('text-blue-700');
        expect(classes.combined).toContain('dark:text-blue-300');
        expect(classes.dot).toContain('bg-blue-500');
    });

    it('returns emerald theme classes with dark mode support for Kabupaten', () => {
        const classes = getTingkatBadgeClasses('Kabupaten');
        expect(classes.combined).toContain('text-emerald-700');
        expect(classes.combined).toContain('dark:text-emerald-300');
        expect(classes.dot).toContain('bg-emerald-500');
    });

    it('returns neutral fallback for unknown or empty tingkat without crashing', () => {
        const fallbackEmpty = getTingkatBadgeClasses(null);
        expect(fallbackEmpty.combined).toContain('text-slate-700');
        expect(fallbackEmpty.combined).toContain('dark:text-slate-300');

        const fallbackUnknown = getTingkatBadgeClasses('Lainnya' as TingkatPrestasi);
        expect(fallbackUnknown.combined).toContain('text-slate-700');
    });
});
