import { SCHOOL_NAME } from "@/lib/school-config";

export function generateOpiniSlug(judul: string): string {
  const cleanTitle = judul
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const randomSuffix = Math.random().toString(36).substring(2, 8).padEnd(6, "0");
  return `${cleanTitle}-${randomSuffix}`;
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const strippedText = text.replace(/<[^>]*>/g, " ");
  const wordCount = strippedText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppUrl(payload: {
  phone: string;
  namaPenulis: string;
  judul: string;
  status: "terbit" | "ditolak";
  urlArtikel?: string;
  catatanRedaksi?: string;
}): string {
  const cleanPhone = formatWhatsAppNumber(payload.phone);
  let message = "";

  if (payload.status === "terbit") {
    message = `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${payload.namaPenulis}, naskah opini Anda berjudul "${payload.judul}" telah selesai ditelaah dan resmi diterbitkan di Ruang Perspektif ${SCHOOL_NAME}.\n\nTautan membaca:\n${payload.urlArtikel || ""}\n\nTerima kasih atas kontribusi pemikirannya bagi kemajuan madrasah kita. Jazakumullah khairan.`;
  } else {
    message = `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${payload.namaPenulis}, terima kasih telah mengirimkan naskah opini ke Ruang Perspektif ${SCHOOL_NAME} dengan judul "${payload.judul}".\n\nSetelah melalui telaah redaksi, saat ini naskah belum dapat kami publikasikan karena:\n"${payload.catatanRedaksi || "Perlu penyelarasan materi"}"\n\nSemoga berkenan menyempurnakan dan mengirimkan tulisan di edisi berikutnya. Terima kasih.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
