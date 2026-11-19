import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within, cleanup } from "@testing-library/react";
import { TabStrukturOrganisasi } from "@/components/admin/konten/TabStrukturOrganisasi";
import { saveStrukturOrganisasiAction } from "@/app/admin/konten/actions";
import { toast } from "sonner";
import type { StrukturOrganisasiContent } from "@/lib/types/content";

vi.mock("@/app/admin/konten/actions", () => ({
  saveStrukturOrganisasiAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn().mockReturnValue("toast-id"),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/components/admin/konten/ImageUploader", () => ({
  ImageUploader: ({
    label,
    value,
    onChange,
    folder,
    aspectRatio,
  }: {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
    aspectRatio?: string;
  }) => (
    <div
      data-testid="mock-image-uploader"
      data-folder={folder}
      data-aspect-ratio={aspectRatio}
    >
      <label>
        {label}
        <input
          aria-label={label}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  ),
}));

function makeInitialData(): StrukturOrganisasiContent {
  return {
    hero: {
      badge: "Struktur Kepemimpinan & Pendidik",
      judul: "Struktur Organisasi MI Muhammadiyah Dimoro",
      subjudul: "Susunan pimpinan, wali kelas, dan dewan guru madrasah.",
      tahun_ajaran: "Tahun Ajaran 2026/2027",
    },
    personil: [
      { id: "p-bandowi", nama: "Bandowi", foto_url: "", gender: "L" },
      { id: "p-anik", nama: "Anik Sulistyowati, S.Ag.", foto_url: "", gender: "P" },
      { id: "p-dalyani", nama: "Dalyani Sri Rahayu, S.Pd", foto_url: "", gender: "P" },
      { id: "p-warih", nama: "Warih Agung Sumiwi, S.Pd.I", foto_url: "", gender: "P" },
      { id: "p-bebas", nama: "Guru Tanpa Jabatan", foto_url: "", gender: "L" },
    ],
    komite: { id: "komite", jabatan: "Komite Madrasah", personil_id: "p-bandowi" },
    kamad: { id: "kamad", jabatan: "Kepala Madrasah (Kamad)", personil_id: "p-anik" },
    administrasi: [
      { id: "bendahara", jabatan: "Bendahara", personil_id: "p-dalyani" },
    ],
    waka: [
      {
        id: "waka-kurikulum",
        jabatan: "Waka Kurikulum",
        personil_id: "p-warih",
        sub_unit: {
          id: "koord-perpus",
          jabatan: "Koord. Perpus",
          personil_id: "p-dalyani",
        },
      },
      {
        id: "waka-sarpras",
        jabatan: "Waka Sarpras",
        personil_id: "",
        sub_unit: null,
      },
    ],
    penunjang: [
      { id: "penjaga-sekolah", jabatan: "Penjaga Sekolah", personil_id: "" },
    ],
    wali_kelas: [
      { id: "wali-3a", jabatan: "Wali Kelas III A", personil_id: "p-warih" },
    ],
    dewan_guru_label: "Dewan Guru",
    guru_mapel: [
      { id: "guru-mapel-1", jabatan: "Guru Mapel", personil_id: "" },
    ],
    siswa_label: "Siswa",
  };
}

describe("TabStrukturOrganisasi", () => {
  const mockedSave = vi.mocked(saveStrukturOrganisasiAction);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedSave.mockResolvedValue({
      success: true,
      message: "Konten Struktur Organisasi berhasil diperbarui!",
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("merender Header & Metadata, Bagian A (Direktori Profil Guru & Staf), dan Bagian B (Susunan Jabatan & Bagan)", () => {
    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    expect(screen.getByText(/Header & Metadata/i)).toBeDefined();
    expect((screen.getByLabelText(/Badge/i) as HTMLInputElement).value).toBe(
      "Struktur Kepemimpinan & Pendidik"
    );
    expect((screen.getByLabelText(/Judul Halaman/i) as HTMLInputElement).value).toBe(
      "Struktur Organisasi MI Muhammadiyah Dimoro"
    );
    expect((screen.getByLabelText(/Subjudul/i) as HTMLTextAreaElement).value).toBe(
      "Susunan pimpinan, wali kelas, dan dewan guru madrasah."
    );
    expect((screen.getByLabelText(/Tahun Ajaran/i) as HTMLInputElement).value).toBe(
      "Tahun Ajaran 2026/2027"
    );
    expect((screen.getByLabelText(/Label Dewan Guru/i) as HTMLInputElement).value).toBe(
      "Dewan Guru"
    );
    expect((screen.getByLabelText(/Label Siswa/i) as HTMLInputElement).value).toBe(
      "Siswa"
    );

    expect(
      screen.getByText(/Bagian A.*Direktori Profil Guru & Staf/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Bagian B.*Susunan Jabatan & Bagan/i)
    ).toBeDefined();

    expect(
      screen.getByRole("heading", { name: /Pimpinan & Komite/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /^Administrasi/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /Wakil Kepala & Sub-Unit/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /^Penunjang/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /^Wali Kelas/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /^Guru Mapel/i })
    ).toBeDefined();

    const uploaders = screen.getAllByTestId("mock-image-uploader");
    expect(uploaders.length).toBe(5);
    uploaders.forEach((uploader) => {
      expect(uploader.getAttribute("data-folder")).toBe("struktur-organisasi");
      expect(uploader.getAttribute("data-aspect-ratio")).toBe("square");
    });
  });

  it("menambah guru/staf baru melalui tombol Tambah Guru/Staf dan memunculkan namanya di opsi select jabatan", async () => {
    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    const addButton = screen.getByRole("button", { name: /Tambah Guru\/Staf/i });
    fireEvent.click(addButton);

    const namaInputs = screen.getAllByLabelText(/Nama Lengkap/i) as HTMLInputElement[];
    expect(namaInputs.length).toBe(6);

    const newNamaInput = namaInputs[namaInputs.length - 1];
    fireEvent.change(newNamaInput, { target: { value: "Ustadz Ahmad, S.Pd" } });

    const holderSelects = screen.getAllByLabelText(/^Pemegang Jabatan$/i) as HTMLSelectElement[];
    expect(holderSelects.length).toBeGreaterThan(0);

    const firstSelect = holderSelects[0];
    const optionTexts = Array.from(firstSelect.options).map((o) => o.textContent);
    expect(optionTexts).toContain("Ustadz Ahmad, S.Pd");

    // Pilih personil baru pada slot Komite Madrasah dan simpan
    const newOption = Array.from(firstSelect.options).find(
      (o) => o.textContent === "Ustadz Ahmad, S.Pd"
    );
    expect(newOption).toBeDefined();
    fireEvent.change(firstSelect, { target: { value: newOption!.value } });

    const saveButton = screen.getByRole("button", {
      name: /Simpan Struktur Organisasi/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedSave).toHaveBeenCalledTimes(1);
    });

    const savedPayload = mockedSave.mock.calls[0][0];
    expect(savedPayload.personil).toHaveLength(6);
    expect(savedPayload.personil[5].nama).toBe("Ustadz Ahmad, S.Pd");
    expect(savedPayload.komite.personil_id).toBe(newOption!.value);
  });

  it("menghapus personil yang menjabat di beberapa slot akan mengosongkan personil_id menjadi '' termasuk sub_unit dan memanggil toast.info", async () => {
    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    // Dalyani memegang slot Administrasi (Bendahara) dan sub_unit Waka Kurikulum (Koord. Perpus) => 2 slot
    const deleteDalyaniBtn = screen.getByRole("button", {
      name: /Hapus personil Dalyani Sri Rahayu, S\.Pd/i,
    });
    fireEvent.click(deleteDalyaniBtn);

    expect(toast.info).toHaveBeenCalledTimes(1);
    const infoMessage = vi.mocked(toast.info).mock.calls[0][0] as string;
    expect(infoMessage).toContain("2");

    // Hapus personil tanpa jabatan tidak memanggil toast.info tambahan
    const deleteBebasBtn = screen.getByRole("button", {
      name: /Hapus personil Guru Tanpa Jabatan/i,
    });
    fireEvent.click(deleteBebasBtn);
    expect(toast.info).toHaveBeenCalledTimes(1);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Struktur Organisasi/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedSave).toHaveBeenCalledTimes(1);
    });

    const savedPayload = mockedSave.mock.calls[0][0];
    expect(savedPayload.personil.some((p) => p.id === "p-dalyani")).toBe(false);
    expect(savedPayload.personil.some((p) => p.id === "p-bebas")).toBe(false);
    expect(savedPayload.administrasi[0].personil_id).toBe("");
    expect(savedPayload.waka[0].sub_unit?.personil_id).toBe("");
    // Slot Waka Kurikulum (p-warih) tetap terjaga
    expect(savedPayload.waka[0].personil_id).toBe("p-warih");
  });

  it("memiliki tombol simpan utama type='button' dengan class bg-emerald-600 dan memanggil saveStrukturOrganisasiAction + toast.success", async () => {
    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Struktur Organisasi/i,
    }) as HTMLButtonElement;

    expect(saveButton.type).toBe("button");
    expect(saveButton.className).toContain("bg-emerald-600");

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalled();
      expect(mockedSave).toHaveBeenCalledTimes(1);
      expect(mockedSave).toHaveBeenCalledWith(makeInitialData());
      expect(toast.success).toHaveBeenCalledWith(
        "Konten Struktur Organisasi berhasil diperbarui!",
        { id: "toast-id" }
      );
    });
  });

  it("menampilkan toast.error saat saveStrukturOrganisasiAction mengembalikan success: false", async () => {
    mockedSave.mockResolvedValueOnce({
      success: false,
      message: "Akses ditolak",
    });

    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Struktur Organisasi/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Akses ditolak"),
        { id: "toast-id" }
      );
    });
  });

  it("dapat toggle sub_unit pada slot Waka serta mengubah foto dan gender personil", async () => {
    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    // Edit foto via ImageUploader mock
    const bandowiPhotoInput = screen.getByLabelText(/Foto Bandowi/i);
    fireEvent.change(bandowiPhotoInput, {
      target: { value: "https://cdn.test/bandowi.webp" },
    });

    // Edit gender Bandowi ke P lalu kembali ke L
    const genderSelects = screen.getAllByLabelText(/Jenis Kelamin/i) as HTMLSelectElement[];
    fireEvent.change(genderSelects[0], { target: { value: "P" } });

    // Waka Sarpras belum punya sub_unit -> klik Tambah Sub-Unit
    const wakaSarprasCard = screen.getByDisplayValue("Waka Sarpras").closest("[data-slot-card]");
    expect(wakaSarprasCard).not.toBeNull();
    const addSubUnitBtn = within(wakaSarprasCard as HTMLElement).getByRole("button", {
      name: /Tambah Sub-Unit/i,
    });
    fireEvent.click(addSubUnitBtn);

    const subUnitJabatanInput = within(wakaSarprasCard as HTMLElement).getByLabelText(
      /^Jabatan Sub-Unit$/i
    );
    fireEvent.change(subUnitJabatanInput, { target: { value: "Koord. Kebersihan" } });

    const subUnitHolderSelect = within(wakaSarprasCard as HTMLElement).getByLabelText(
      /^Pemegang Jabatan Sub-Unit$/i
    );
    fireEvent.change(subUnitHolderSelect, { target: { value: "p-bandowi" } });

    // Hapus sub_unit pada Waka Kurikulum (waka[0])
    const wakaKurikulumCard = screen
      .getByDisplayValue("Waka Kurikulum")
      .closest("[data-slot-card]");
    expect(wakaKurikulumCard).not.toBeNull();
    const removeSubUnitBtn = within(wakaKurikulumCard as HTMLElement).getByRole(
      "button",
      { name: /Hapus Sub-Unit/i }
    );
    fireEvent.click(removeSubUnitBtn);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Struktur Organisasi/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedSave).toHaveBeenCalledTimes(1);
    });

    const savedPayload = mockedSave.mock.calls[0][0];
    expect(savedPayload.personil[0].foto_url).toBe("https://cdn.test/bandowi.webp");
    expect(savedPayload.personil[0].gender).toBe("P");
    expect(savedPayload.waka[0].sub_unit).toBeNull();
    expect(savedPayload.waka[1].sub_unit).toEqual(
      expect.objectContaining({
        jabatan: "Koord. Kebersihan",
        personil_id: "p-bandowi",
      })
    );
  });

  it("dapat menambah dan menghapus slot jabatan pada grup daftar seperti Administrasi", async () => {
    render(<TabStrukturOrganisasi initialData={makeInitialData()} />);

    const addAdminBtn = screen.getByRole("button", { name: /Tambah Administrasi/i });
    fireEvent.click(addAdminBtn);

    const tataUsahaCard = screen
      .getByText("Administrasi #2")
      .closest("[data-slot-card]");
    expect(tataUsahaCard).not.toBeNull();

    const jabatanInput = within(tataUsahaCard as HTMLElement).getByLabelText(
      /^Nama Jabatan$/i
    );
    fireEvent.change(jabatanInput, { target: { value: "Tata Usaha" } });

    // Hapus slot lama (Bendahara)
    const removeBendaharaBtn = screen.getByRole("button", {
      name: /Hapus slot Bendahara/i,
    });
    fireEvent.click(removeBendaharaBtn);

    const saveButton = screen.getByRole("button", {
      name: /Simpan Struktur Organisasi/i,
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedSave).toHaveBeenCalledTimes(1);
    });

    const savedPayload = mockedSave.mock.calls[0][0];
    expect(savedPayload.administrasi).toHaveLength(1);
    expect(savedPayload.administrasi[0].jabatan).toBe("Tata Usaha");
  });
});
