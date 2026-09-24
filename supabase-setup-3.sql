-- ═══════════════════════════════════════════════════════════
-- ترقية جَزَرة 3 — مزامنة تحفظ الإنجازات عند تعارض الأجهزة
-- نفّذ هذا الملف مرة واحدة في Supabase SQL Editor للأسر التي فعّلت المزامنة.
-- لا يحذف بيانات أو يغير الجداول؛ يضيف إجراء كتابة متفائلة فقط.
-- ═══════════════════════════════════════════════════════════

create or replace function public.family_push_cas(
  code text,
  new_state jsonb,
  expected_updated_at timestamptz default null
)
returns table(ok boolean, state jsonb, updated_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare
  f_id uuid;
  f_state jsonb;
  f_updated_at timestamptz;
begin
  -- قفل صف الأسرة لفترة قصيرة حتى لا يكتب جهازان فوق بعضهما في اللحظة نفسها.
  select id, state, updated_at into f_id, f_state, f_updated_at
  from public.families
  where join_code = code
  for update;

  if f_id is null then
    raise exception 'family not found';
  end if;

  -- لا يوجد تعارض إذا كانت نسخة الجهاز هي نفس آخر نسخة في السحابة.
  if expected_updated_at is null or f_updated_at = expected_updated_at then
    update public.families
    set state = new_state
    where id = f_id
    returning families.state, families.updated_at into f_state, f_updated_at;
    return query select true, f_state, f_updated_at;
  end if;

  -- أعد الحالة الأحدث بدل الكتابة فوقها؛ العميل يدمج الأحداث ثم يعيد المحاولة مرة واحدة.
  return query select false, f_state, f_updated_at;
end $$;

grant execute on function public.family_push_cas(text, jsonb, timestamptz) to anon, authenticated;
