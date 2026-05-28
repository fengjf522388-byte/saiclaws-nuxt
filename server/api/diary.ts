// server/api/diary.ts — GET /api/diary
export default defineEventHandler(async () => {
  const client = useSupabaseClient()

  const { data } = await client.from('study_diary')
    .select('*')
    .neq('is_deleted', true)
    .order('entry_date', { ascending: false })
    .limit(10)

  return data || []
})
