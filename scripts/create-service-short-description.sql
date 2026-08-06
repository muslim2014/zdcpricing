-- إضافة عمود الوصف المختصر إلى جدول الخدمات
-- شغّل هذا الملف في محرر SQL في Supabase (SQL Editor)

alter table public.services
  add column if not exists short_description text;