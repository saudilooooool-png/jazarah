-- ═══════════════════════════════════════════════════════════
-- إعداد جَزَرة السحابي — نفّذ هذا الملف مرة واحدة فقط:
-- لوحة Supabase ← SQL Editor ← الصق المحتوى كاملًا ← Run
-- ═══════════════════════════════════════════════════════════

-- جدول العائلات: كل عائلة صف واحد يحمل حالة التطبيق كاملة
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  join_code text unique not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- حماية الصفوف: الوالد المالك فقط يصل لصف عائلته مباشرة
alter table public.families enable row level security;

drop policy if exists "families_owner_all" on public.families;
create policy "families_owner_all" on public.families
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

-- تحديث طابع الوقت تلقائيًا عند أي تعديل
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists families_touch on public.families;
create trigger families_touch before update on public.families
  for each row execute function public.touch_updated_at();

-- دوال دخول الأجهزة برمز العائلة (جوالات الأطفال — بلا حساب بريد)
-- من يملك الرمز يستطيع القراءة والكتابة لعائلته فقط
create or replace function public.family_pull(code text)
returns table(state jsonb, updated_at timestamptz)
language sql security definer set search_path = public as $$
  select f.state, f.updated_at from public.families f where f.join_code = code;
$$;

create or replace function public.family_push(code text, new_state jsonb)
returns timestamptz
language plpgsql security definer set search_path = public as $$
declare ts timestamptz;
begin
  update public.families set state = new_state where join_code = code
  returning updated_at into ts;
  return ts;
end $$;

grant execute on function public.family_pull(text) to anon, authenticated;
grant execute on function public.family_push(text, jsonb) to anon, authenticated;
