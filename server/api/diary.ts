import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client.from('study_diary').select('*').neq('is_deleted', true).order('entry_date', { ascending: false }).limit(10)
  return data || []
})
