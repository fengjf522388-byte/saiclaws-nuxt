// server/api/stats.ts — Dashboard 统计数据
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const today = new Date().toISOString().slice(0, 10)

  const [{ count: kb }, { count: diary }, { count: memos }, { count: records }] = await Promise.all([
    client.from('knowledge_base').select('*', { count: 'exact', head: true }).neq('is_deleted', true),
    client.from('study_diary').select('*', { count: 'exact', head: true }).neq('is_deleted', true),
    client.from('daily_memos').select('*', { count: 'exact', head: true }).eq('memo_date', today).neq('is_deleted', true),
    client.from('study_records').select('*', { count: 'exact', head: true }).neq('is_deleted', true).catch(() => ({ count: 0 })),
  ])

  const { data: cards } = await client.from('flashcards').select('id').neq('is_deleted', true)
  const { data: reviews } = await client.from('flashcard_reviews').select('flashcard_id, next_review_at').order('reviewed_at', { ascending: false }).limit(1000)
  const reviewMap: Record<string, string> = {}
  reviews?.forEach((r: any) => { if (!reviewMap[r.flashcard_id]) reviewMap[r.flashcard_id] = r.next_review_at })
  let srsDue = 0
  cards?.forEach((c: any) => { const next = reviewMap[c.id]; if (!next || new Date(next) <= new Date()) srsDue++ })

  const { data: sessions } = await client.from('study_sessions').select('pomodoro_count, duration_minutes').eq('session_date', today)

  return {
    knowledge: kb || 0, diary: diary || 0, todayMemos: memos || 0, srsDue,
    studyRecords: records || 0,
    pomoToday: sessions?.reduce((s, r: any) => s + (r.pomodoro_count || 0), 0) || 0,
    pomoMinutes: sessions?.reduce((s, r: any) => s + (r.duration_minutes || 0), 0) || 0
  }
})
