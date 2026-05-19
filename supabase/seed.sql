-- Supabase Seed File
-- Insert default required contents here

INSERT INTO public.konten_halaman (slug, judul, isi) 
VALUES 
  ('persyaratan-pendaftaran', 'Persyaratan Pendaftaran', '{"blocks": [{"text": "Daftar persyaratan pendaftaran..."}]}'),
  ('catatan-spp', 'Catatan SPP', '{"blocks": [{"text": "Info dan detail catatan beban biaya bulanan atau SPP."}]}'),
  ('jadwal-pendaftaran', 'Jadwal Pendaftaran', '{"blocks": [{"text": "Pendaftaran gelombang 1 dibuka bulan..."}]}')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.biaya_pendaftaran (komponen_biaya, biaya_putra, biaya_putri)
VALUES
  ('Biaya Formulir', 200000, 200000),
  ('Dana Pendidikan', 1500000, 1500000),
  ('Seragam', 600000, 650000)
ON CONFLICT DO NOTHING;

-- Buat Akun Admin Default (admin@mimpkdimoro.sch.id / admin123)
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'admin@mimpkdimoro.sch.id',
            crypt ('admin123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
    );
