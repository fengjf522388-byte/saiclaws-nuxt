// server/api/study-records.ts — 学习记录 API
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = getQuery(event)

  let q = client.from('study_records')
    .select('*').neq('is_deleted', true)
    .order('study_date', { ascending: false })
    .order('chapter_no')

  if (query.subject) q = q.eq('subject', query.subject)
  if (query.chapter_no) q = q.eq('chapter_no', Number(query.chapter_no))

  const { data } = await q.limit(Number(query.limit) || 100)
  return data || []
})
