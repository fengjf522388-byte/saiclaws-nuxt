-- saiclaws.com 数据保护：开启行级安全（RLS），只允许已登录用户访问
-- 在 Supabase 后台 → SQL Editor 里整段执行一次。
-- 注意：请先部署登录功能并注册好你的账号，再执行本脚本，否则应用会因未登录而被拒绝访问。

alter table knowledge_base enable row level security;
alter table study_diary enable row level security;
alter table daily_memos enable row level security;
alter table flashcards enable row level security;
alter table flashcard_reviews enable row level security;
alter table study_sessions enable row level security;
alter table study_records enable row level security;

create policy "auth_all" on knowledge_base for all to authenticated using (true) with check (true);
create policy "auth_all" on study_diary for all to authenticated using (true) with check (true);
create policy "auth_all" on daily_memos for all to authenticated using (true) with check (true);
create policy "auth_all" on flashcards for all to authenticated using (true) with check (true);
create policy "auth_all" on flashcard_reviews for all to authenticated using (true) with check (true);
create policy "auth_all" on study_sessions for all to authenticated using (true) with check (true);
create policy "auth_all" on study_records for all to authenticated using (true) with check (true);
