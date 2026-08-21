"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  Loader2,
  MessageCircle,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SCHOOL_NAME, SCHOOL_WHATSAPP } from "@/lib/school-config";
import { getWhatsAppUrl } from "./ContactFAQ";

// Contact form validation schema
const formSchema = z.object({
  nama_pengirim: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email_pengirim: z.string().email({ message: "Format email tidak valid" }),
  telepon: z
    .string()
    .min(10, { message: "Nomor telepon minimal 10 digit" })
    .regex(/^[0-9+\-\s]+$/, {
      message:
        "Nomor telepon hanya boleh mengandung angka, spasi, tanda plus, dan tanda hubung",
    }),
  subjek: z.string().min(1, { message: "Pilih subjek pesan" }),
  isi_pesan: z.string().min(10, { message: "Pesan minimal 10 karakter" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_pengirim: "",
      email_pengirim: "",
      telepon: "",
      subjek: "",
      isi_pesan: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Insert message to database pesan_masuk
      const { error: insertError } = await supabase.from("pesan_masuk").insert([
        {
          nama_pengirim: values.nama_pengirim,
          email_pengirim: values.email_pengirim,
          telepon: values.telepon,
          subjek: values.subjek,
          isi_pesan: values.isi_pesan,
          status: "belum_dibaca",
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSubmittedData(values);
      setSubmitted(true);
      toast.success("Pesan Terkirim!", {
        description: `Terima kasih telah menghubungi ${SCHOOL_NAME}. Kami akan segera merespons.`,
      });

      // Reset form fields
      form.reset();
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Gagal mengirim pesan. Silakan periksa koneksi atau coba lagi.");
      toast.error("Gagal Mengirim Pesan", {
        description: "Terjadi kendala saat mengirim pesan. Silakan coba kembali.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Generate WhatsApp follow-up link for submitted message
  const waFollowUpText = submittedData
    ? `Halo Admin ${SCHOOL_NAME}, saya (${submittedData.nama_pengirim}) baru saja mengirim pesan melalui formulir kontak website mengenai "${submittedData.subjek}". Mohon konfirmasi.`
    : `Halo Admin ${SCHOOL_NAME}, saya ingin menindaklanjuti pesan yang baru saja dikirim via formulir kontak website.`;

  const waFollowUpUrl = getWhatsAppUrl(SCHOOL_WHATSAPP, waFollowUpText);

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-card/95 backdrop-blur-sm p-6 sm:p-8 md:p-9 shadow-xl shadow-emerald-950/5 transition-all duration-300">
      {/* Decorative Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      {!submitted ? (
        <>
          {/* Header */}
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formulir Pesan Cepat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Kirim Pesan
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sampaikan pertanyaan, saran, atau permohonan informasi kepada tim madrasah kami.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Nama Lengkap */}
              <FormField
                control={form.control}
                name="nama_pengirim"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap"
                        className="h-11 rounded-xl bg-background/60 border-input hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Email & No. Telepon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email_pengirim"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan email"
                          type="email"
                          className="h-11 rounded-xl bg-background/60 border-input hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telepon"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        No. Telepon
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nomor telepon"
                          className="h-11 rounded-xl bg-background/60 border-input hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subjek */}
              <FormField
                control={form.control}
                name="subjek"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                      <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Subjek
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl bg-background/60 border-input hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                          <SelectValue placeholder="Pilih subjek pesan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-lg border-emerald-500/20">
                        <SelectItem value="pendaftaran" className="rounded-lg py-2.5">
                          Informasi Pendaftaran (PPDB)
                        </SelectItem>
                        <SelectItem value="biaya" className="rounded-lg py-2.5">
                          Biaya & Administrasi
                        </SelectItem>
                        <SelectItem value="program" className="rounded-lg py-2.5">
                          Program Unggulan & Tahfidz
                        </SelectItem>
                        <SelectItem value="kunjungan" className="rounded-lg py-2.5">
                          Kunjungan & Info Madrasah
                        </SelectItem>
                        <SelectItem value="keluhan" className="rounded-lg py-2.5">
                          Saran / Masukan
                        </SelectItem>
                        <SelectItem value="lainnya" className="rounded-lg py-2.5">
                          Lainnya
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Pesan */}
              <FormField
                control={form.control}
                name="isi_pesan"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                      <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Pesan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis pesan Anda"
                        className="resize-none min-h-[135px] rounded-xl bg-background/60 border-input hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Error Notice */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-xl p-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-base shadow-md hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.99] transition-all duration-200 gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Mengirim Pesan...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Kirim Pesan</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        /* Success Screen */
        <div className="py-8 px-2 flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated Success Badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="absolute -inset-1 rounded-full border border-emerald-500/20 animate-ping pointer-events-none opacity-40" />
          </div>

          <div className="space-y-3 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Pesan Terkirim!
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Terima kasih telah menghubungi <strong className="text-foreground">{SCHOOL_NAME}</strong>.
              Pesan Anda telah kami terima dan tim kami akan segera merespons melalui nomor telepon atau email yang Anda cantumkan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm flex flex-col gap-3 pt-2">
            <Button
              asChild
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md gap-2"
            >
              <a
                href={waFollowUpUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp</span>
              </a>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setSubmittedData(null);
                setError(null);
              }}
              className="w-full h-11 rounded-xl border-emerald-500/30 hover:bg-emerald-500/5 text-foreground font-medium gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Kirim Pesan Lainnya</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}