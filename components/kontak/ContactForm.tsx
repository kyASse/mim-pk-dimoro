"use client";

import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, CheckCircle2 } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

// Contact form validation schema
const formSchema = z.object({
  nama_pengirim: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email_pengirim: z.string().email({ message: "Format email tidak valid" }),
  telepon: z.string()
    .min(10, { message: "Nomor telepon minimal 10 digit" })
    .regex(/^[0-9+\-\s]+$/, { message: "Nomor telepon hanya boleh mengandung angka, spasi, tanda plus, dan tanda hubung" }),
  subjek: z.string().min(1, { message: "Pilih subjek pesan" }),
  isi_pesan: z.string().min(10, { message: "Pesan minimal 10 karakter" }),
});

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Insert pesan ke database pesan_masuk
      const { error: insertError } = await supabase
        .from('pesan_masuk')
        .insert([
          {
            nama_pengirim: values.nama_pengirim,
            email_pengirim: values.email_pengirim,
            telepon: values.telepon,
            subjek: values.subjek,
            isi_pesan: values.isi_pesan,
            status: 'belum_dibaca',
// Removed the created_at field to let the database handle timestamp generation.
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
      toast.success("Pesan Terkirim!", {
        description: "Terima kasih telah menghubungi kami. Kami akan merespons segera.",
      });

      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Gagal mengirim pesan. Silakan coba lagi.');
      toast.error("Gagal Mengirim Pesan", {
        description: "Terjadi kesalahan. Silakan coba lagi nanti.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      {!submitted ? (
        <>
          <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nama_pengirim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email_pengirim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nomor telepon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subjek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjek</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih subjek pesan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendaftaran">Informasi Pendaftaran</SelectItem>
                        <SelectItem value="biaya">Informasi Biaya</SelectItem>
                        <SelectItem value="program">Informasi Program</SelectItem>
                        <SelectItem value="kunjungan">Permintaan Kunjungan</SelectItem>
                        <SelectItem value="keluhan">Keluhan atau Saran</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isi_pesan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tulis pesan Anda"
                        className="resize-none min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              >
                {submitting ? (
                  "Mengirim Pesan..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Kirim Pesan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Pesan Terkirim!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Terima kasih telah menghubungi TK ABA Mertosanan. 
            Pesan Anda telah terkirim dan kami akan merespons secepatnya.
          </p>
          <Button 
            onClick={() => {
              setSubmitted(false);
              setError(null);
            }}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Kirim Pesan Lainnya
          </Button>
        </div>
      )}
    </div>
  );
}