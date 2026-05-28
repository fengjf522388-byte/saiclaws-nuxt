import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await client.from('daily_memos').select('*').eq('memo_date', today).neq('is_deleted', true).order('id')
  return data || []
})
