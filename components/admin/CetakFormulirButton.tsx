'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export type PendaftarPrintData = {
    id?: string;
    nama_lengkap?: string | null;
    nama_panggilan?: string | null;
    jenis_kelamin?: string | null;
    tempat_lahir?: string | null;
    tanggal_lahir?: string | null;
    agama?: string | null;
    kewarganegaraan?: string | null;
    status_anak?: string | null;
    anak_ke?: number | string | null;
    jumlah_saudara_kandung?: number | string | null;
    bahasa_sehari_hari?: string | null;
    tk_asal?: string | null;
    cita_cita?: string | null;
    hobi?: string | null;
    alamat_lengkap?: string | null;
    nomor_telepon?: string | null;
    jarak_tempat_tinggal?: string | number | null;
    transportasi?: string | null;
    berat_badan?: number | string | null;
    tinggi_badan?: number | string | null;
    golongan_darah?: string | null;
    nama_ayah_kandung?: string | null;
    pendidikan_ayah?: string | null;
    pekerjaan_ayah?: string | null;
    nama_ibu_kandung?: string | null;
    pendidikan_ibu?: string | null;
    pekerjaan_ibu?: string | null;
    alamat_orang_tua?: string | null;
    gaji_orang_tua?: string | null;
    email?: string | null;
    wali_nama?: string | null;
    wali_hubungan?: string | null;
    wali_pendidikan?: string | null;
    wali_pekerjaan?: string | null;
    wali_alamat?: string | null;
    wali_telepon?: string | null;
    memiliki_kebutuhan_khusus?: boolean | string | null;
    jenis_kebutuhan_khusus?: string | string[] | null;
    deskripsi_kebutuhan_khusus?: string | null;
    nomor_induk?: string | null;
    diterima_di_kelas?: string | null;
    diterima_pada_tanggal?: string | null;
    created_at?: string | null;
};

interface CetakFormulirButtonProps {
    pendaftar: PendaftarPrintData;
    className?: string;
}

export default function CetakFormulirButton({ pendaftar, className }: CetakFormulirButtonProps) {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    // Calculate academic year
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const tahunPelajaran = `${currentYear}/${nextYear}`;

    const printDate = formatDate(pendaftar.diterima_pada_tanggal || pendaftar.created_at || new Date().toISOString());

    const jenisKebutuhanArray = Array.isArray(pendaftar.jenis_kebutuhan_khusus)
        ? pendaftar.jenis_kebutuhan_khusus
        : (typeof pendaftar.jenis_kebutuhan_khusus === 'string'
            ? (() => {
                try { return JSON.parse(pendaftar.jenis_kebutuhan_khusus); } catch { return [pendaftar.jenis_kebutuhan_khusus]; }
            })()
            : []);

    return (
        <>
            {/* Action Trigger Button */}
            <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className={`flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-50 shadow-sm ${className || ''}`}
            >
                <Printer className="w-4 h-4 text-gray-700" />
                <span>Cetak Formulir Resmi</span>
            </Button>

            {/* Print Container & Embedded CSS */}
            <style jsx global>{`
                @media screen {
                    .print-only-container {
                        display: none !important;
                    }
                }
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm 15mm 12mm 15mm;
                    }
                    body {
                        visibility: hidden !important;
                        background: white !important;
                        color: black !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-only-container {
                        visibility: visible !important;
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        font-family: "Times New Roman", Times, serif;
                        font-size: 11pt;
                        line-height: 1.35;
                        color: #000 !important;
                    }
                    .print-only-container * {
                        visibility: visible !important;
                    }
                }
            `}</style>

            <div id="print-formulir-mim" className="print-only-container">
                {/* KOP SURAT RESMI */}
                <div className="text-center pb-2 mb-3 border-b-4 border-double border-black">
                    <h3 className="text-[13pt] font-bold uppercase tracking-wide leading-tight">
                        MAJELIS PENDIDIKAN DASAR DAN MENENGAH
                    </h3>
                    <h3 className="text-[13pt] font-bold uppercase tracking-wide leading-tight">
                        PIMPINAN DAERAH MUHAMMADIYAH SUKOHARJO
                    </h3>
                    <h2 className="text-[15pt] font-extrabold uppercase tracking-wider leading-snug my-0.5">
                        MADRASAH IBTIDAIYAH MUHAMMADIYAH ( MIM ) DIMORO
                    </h2>
                    <p className="text-[10pt] font-semibold tracking-wider uppercase">
                        STATUS TERAKREDITASI A
                    </p>
                    <p className="text-[9.5pt] italic text-gray-800 leading-tight mt-0.5">
                        Alamat : Dimoro Rt. 03 / Rw. X Parangjoro, Grogol Sukoharjo Kode Pos 57552
                    </p>
                </div>

                {/* JUDUL FORMULIR */}
                <div className="text-center my-3">
                    <h1 className="text-[13pt] font-bold uppercase underline tracking-wider">
                        FORMULIR PENDAFTARAN SISWA BARU
                    </h1>
                    <p className="text-[11pt] font-semibold mt-0.5">
                        Tahun Pelajaran {tahunPelajaran}
                    </p>
                </div>

                {/* DATA FORMULIR 27 POIN */}
                <div className="space-y-3 text-[10.5pt]">
                    {/* BAGIAN A: KETERANGAN TENTANG ANAK */}
                    <div>
                        <h4 className="font-bold uppercase text-[11pt] border-b border-black pb-0.5 mb-1.5">
                            A. KETERANGAN TENTANG ANAK
                        </h4>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="w-6 align-top py-0.5">1.</td>
                                    <td className="w-56 align-top py-0.5">Nama Peserta Didik</td>
                                    <td className="w-3 align-top py-0.5">:</td>
                                    <td className="align-top py-0.5 font-semibold">{pendaftar.nama_lengkap || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4 text-gray-700">Nama Panggilan</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.nama_panggilan || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">2.</td>
                                    <td className="align-top py-0.5">Jenis Kelamin</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.jenis_kelamin || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">3.</td>
                                    <td className="align-top py-0.5">Tempat & Tanggal Lahir</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">
                                        {pendaftar.tempat_lahir || '-'}, {formatDate(pendaftar.tanggal_lahir)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">4.</td>
                                    <td className="align-top py-0.5">Agama</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.agama || 'Islam'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">5.</td>
                                    <td className="align-top py-0.5">Kewarganegaraan</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.kewarganegaraan || 'WNI'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">6.</td>
                                    <td className="align-top py-0.5">Status Anak dalam Keluarga</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.status_anak || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">7.</td>
                                    <td className="align-top py-0.5">Anak ke</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.anak_ke ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">8.</td>
                                    <td className="align-top py-0.5">Jumlah Saudara Kandung</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.jumlah_saudara_kandung ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">9.</td>
                                    <td className="align-top py-0.5">Bahasa Sehari-hari</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.bahasa_sehari_hari || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">10.</td>
                                    <td className="align-top py-0.5">RA / TK Asal</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.tk_asal || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">11.</td>
                                    <td className="align-top py-0.5">Cita-cita</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.cita_cita || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">12.</td>
                                    <td className="align-top py-0.5">Hobi / Kegemaran</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.hobi || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">13.</td>
                                    <td className="align-top py-0.5">Alamat Tempat Tinggal</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.alamat_lengkap || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">14.</td>
                                    <td className="align-top py-0.5">Nomor Telepon / HP</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.nomor_telepon || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">15.</td>
                                    <td className="align-top py-0.5">Jarak Tempat Tinggal ke Sekolah</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">
                                        {pendaftar.jarak_tempat_tinggal ? `${pendaftar.jarak_tempat_tinggal} km` : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">16.</td>
                                    <td className="align-top py-0.5">Transportasi ke Sekolah</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.transportasi || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">17.</td>
                                    <td className="align-top py-0.5">Kondisi Fisik</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">
                                        Berat: {pendaftar.berat_badan ? `${pendaftar.berat_badan} Kg` : '-'}, 
                                        &nbsp;Tinggi: {pendaftar.tinggi_badan ? `${pendaftar.tinggi_badan} Cm` : '-'}, 
                                        &nbsp;Gol. Darah: {pendaftar.golongan_darah || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* BAGIAN B: KETERANGAN TENTANG ORANG TUA */}
                    <div>
                        <h4 className="font-bold uppercase text-[11pt] border-b border-black pb-0.5 mb-1.5">
                            B. KETERANGAN TENTANG ORANG TUA KANDUNG
                        </h4>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="w-6 align-top py-0.5">18.</td>
                                    <td className="w-56 align-top py-0.5">Nama Orang Tua Kandung</td>
                                    <td className="w-3 align-top py-0.5"></td>
                                    <td className="align-top py-0.5"></td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4">a. Ayah</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5 font-medium">{pendaftar.nama_ayah_kandung || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4">b. Ibu</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5 font-medium">{pendaftar.nama_ibu_kandung || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">19.</td>
                                    <td className="align-top py-0.5">Pendidikan Tertinggi</td>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5"></td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4">a. Ayah</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.pendidikan_ayah || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4">b. Ibu</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.pendidikan_ibu || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">20.</td>
                                    <td className="align-top py-0.5">Pekerjaan</td>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5"></td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4">a. Ayah</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.pekerjaan_ayah || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5"></td>
                                    <td className="align-top py-0.5 pl-4">b. Ibu</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.pekerjaan_ibu || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">21.</td>
                                    <td className="align-top py-0.5">Alamat Domisili Orang Tua</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.alamat_orang_tua || pendaftar.alamat_lengkap || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">22.</td>
                                    <td className="align-top py-0.5">Gaji / Penghasilan Orang Tua</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.gaji_orang_tua || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">23.</td>
                                    <td className="align-top py-0.5">Email Kontak Utama</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.email || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* BAGIAN C: KETERANGAN TENTANG WALI */}
                    <div>
                        <h4 className="font-bold uppercase text-[11pt] border-b border-black pb-0.5 mb-1.5">
                            C. KETERANGAN TENTANG WALI (Bila Ada)
                        </h4>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="w-6 align-top py-0.5">24.</td>
                                    <td className="w-56 align-top py-0.5">Nama Wali</td>
                                    <td className="w-3 align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.wali_nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">25.</td>
                                    <td className="align-top py-0.5">Hubungan dengan Anak</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">{pendaftar.wali_hubungan || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">26.</td>
                                    <td className="align-top py-0.5">Pendidikan / Pekerjaan Wali</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">
                                        {pendaftar.wali_pendidikan || '-'} / {pendaftar.wali_pekerjaan || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">27.</td>
                                    <td className="align-top py-0.5">Alamat & Telepon Wali</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5">
                                        {pendaftar.wali_alamat || '-'} {pendaftar.wali_telepon ? `(Telp: ${pendaftar.wali_telepon})` : ''}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* BAGIAN D: KEBUTUHAN KHUSUS (JIKA ADA) */}
                    {(pendaftar.memiliki_kebutuhan_khusus || jenisKebutuhanArray.length > 0) && (
                        <div>
                            <h4 className="font-bold uppercase text-[11pt] border-b border-black pb-0.5 mb-1.5">
                                D. KEBUTUHAN KHUSUS / KONDISI KHUSUS
                            </h4>
                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr>
                                        <td className="w-6 align-top py-0.5">•</td>
                                        <td className="w-56 align-top py-0.5">Status Kebutuhan Khusus</td>
                                        <td className="w-3 align-top py-0.5">:</td>
                                        <td className="align-top py-0.5">{pendaftar.memiliki_kebutuhan_khusus ? 'Ya' : 'Tidak'}</td>
                                    </tr>
                                    {jenisKebutuhanArray.length > 0 && (
                                        <tr>
                                            <td className="align-top py-0.5">•</td>
                                            <td className="align-top py-0.5">Jenis Kebutuhan Khusus</td>
                                            <td className="align-top py-0.5">:</td>
                                            <td className="align-top py-0.5">{jenisKebutuhanArray.join(', ')}</td>
                                        </tr>
                                    )}
                                    {pendaftar.deskripsi_kebutuhan_khusus && (
                                        <tr>
                                            <td className="align-top py-0.5">•</td>
                                            <td className="align-top py-0.5">Deskripsi</td>
                                            <td className="align-top py-0.5">:</td>
                                            <td className="align-top py-0.5">{pendaftar.deskripsi_kebutuhan_khusus}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* BAGIAN E: DATA ADMINISTRATIF MADRASAH */}
                    <div className="mt-4 pt-2 border-t-2 border-black">
                        <h4 className="font-bold uppercase text-[11pt] mb-1.5">
                            E. DATA ADMINISTRATIF MADRASAH
                        </h4>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="w-6 align-top py-0.5">•</td>
                                    <td className="w-56 align-top py-0.5">Nomor Induk (NIPD/NISN)</td>
                                    <td className="w-3 align-top py-0.5">:</td>
                                    <td className="align-top py-0.5 font-bold">
                                        {pendaftar.nomor_induk || '................................................'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">•</td>
                                    <td className="align-top py-0.5">Diterima di Madrasah ini di</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5 font-bold">
                                        {pendaftar.diterima_di_kelas || 'Kelas 1'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="align-top py-0.5">•</td>
                                    <td className="align-top py-0.5">Diterima pada Tanggal</td>
                                    <td className="align-top py-0.5">:</td>
                                    <td className="align-top py-0.5 font-bold">
                                        {pendaftar.diterima_pada_tanggal ? formatDate(pendaftar.diterima_pada_tanggal) : '................................................'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* TANDA TANGAN */}
                <div className="mt-8 pt-4">
                    <table className="w-full text-center">
                        <tbody>
                            <tr>
                                <td className="w-1/2 align-top"></td>
                                <td className="w-1/2 align-top">
                                    Sukoharjo, {printDate}
                                </td>
                            </tr>
                            <tr>
                                <td className="align-top font-semibold pt-1">
                                    Mengetahui,<br />
                                    Kepala Madrasah
                                </td>
                                <td className="align-top font-semibold pt-1">
                                    Orang Tua / Wali Calon Siswa
                                </td>
                            </tr>
                            <tr>
                                <td className="h-20"></td>
                                <td className="h-20"></td>
                            </tr>
                            <tr>
                                <td className="align-bottom">
                                    <p className="font-bold underline">( .................................................... )</p>
                                    <p className="text-[10pt] mt-1">NIP. .........................................</p>
                                </td>
                                <td className="align-bottom">
                                    <p className="font-bold underline">
                                        (&nbsp;
                                        {pendaftar.nama_ayah_kandung || pendaftar.nama_ibu_kandung || pendaftar.wali_nama || '....................................................'}
                                        &nbsp;)
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
