-- إضافة الأعمدة الجديدة
-- شغّل هذا الملف في محرر SQL في Supabase (SQL Editor)

alter table public.services
  add column if not exists short_description text;

alter table public.services
  add column if not exists sessions text;

alter table public.settings
  add column if not exists categories_page_title text;

alter table public.settings
  add column if not exists whatsapp_number text;