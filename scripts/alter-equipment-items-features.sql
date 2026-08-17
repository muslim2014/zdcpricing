-- ============================================================
--  Equipment Cards — إضافة عمود features لجدول equipment_items
--  (Schema فقط — بدون UI)
--  شغّل هذا الملف في محرر SQL في Supabase (SQL Editor)
-- ============================================================

alter table public.equipment_items
  add column if not exists features text;