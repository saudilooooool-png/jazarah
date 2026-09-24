-- ═══════════════════════════════════════════════════════════
-- إعداد جَزَرة (الجزء 2): التقويم المدرسي المركزي + سوق العروض
-- نفّذه مرة واحدة: لوحة Supabase ← SQL Editor ← الصق ← Run
-- الإدارة بعدها من Table Editor — هذه لوحة تحكم صاحب التطبيق
-- ═══════════════════════════════════════════════════════════

-- التقويم المدرسي: تديره أنت ويُعمم على كل العائلات
create table if not exists public.app_calendar (
  id uuid primary key default gen_random_uuid(),
  title text not null,             -- مثال: إجازة منتصف الفصل الأول
  kind text not null default 'holiday',  -- holiday | long_weekend | term_start | term_end | eid
  start_date date not null,
  end_date date
);

alter table public.app_calendar enable row level security;
drop policy if exists "calendar_public_read" on public.app_calendar;
create policy "calendar_public_read" on public.app_calendar
  for select using (true);
-- لا سياسات إدراج/تعديل: الكتابة من لوحة Supabase فقط (صاحب التطبيق)

-- سوق العروض: عروض التجار حسب المدينة والحي
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  partner text not null,           -- اسم التاجر: مدينة الملاهي
  title text not null,             -- وصف العرض: خصم على التذاكر
  emoji text default '🎟️',
  city text not null,              -- الرياض
  district text,                   -- النرجس (فارغ = كل المدينة)
  cost int not null default 80,    -- سعر القسيمة بالجزر
  code text not null,              -- الكود الذي يُكشف للطفل
  ladder jsonb default '[{"world":0,"off":10},{"world":3,"off":20},{"world":6,"off":30}]'::jsonb,
  -- سلم خصومات رحلة العوالم: كلما تقدم الطفل زاد خصم التاجر
  active boolean not null default true
);

alter table public.offers enable row level security;
drop policy if exists "offers_public_read" on public.offers;
create policy "offers_public_read" on public.offers
  for select using (active = true);

-- أمثلة جاهزة للتجربة (احذفها أو عدلها من Table Editor)
insert into public.app_calendar (title, kind, start_date, end_date) values
  ('إجازة نهاية أسبوع مطولة (مثال — عدّل التاريخ)', 'long_weekend', current_date + 10, current_date + 12),
  ('إجازة منتصف الفصل (مثال — عدّل التاريخ)', 'holiday', current_date + 30, current_date + 37);

insert into public.offers (partner, title, emoji, city, district, cost, code) values
  ('مدينة الملاهي (مثال)', 'خصم على تذاكر الدخول', '🎡', 'الرياض', null, 80, 'JAZ-FUN20');
