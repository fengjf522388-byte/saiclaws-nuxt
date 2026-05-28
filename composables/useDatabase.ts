// composables/useDatabase.ts — Supabase 数据访问层
// Nuxt 3 自动导入 useSupabaseClient()

export function useDatabase() {
  const client = useSupabaseClient()

  // ============ 知识库 ============
  const fetchKnowledge = async () => {
    const { data } = await client.from('knowledge_base')
      .select('*').neq('is_deleted', true)
      .order('chapter_no').order('id')
    return data || []
  }

  const saveKnowledge = async (item: Partial<any>) => {
    const { error } = await client.from('knowledge_base').insert(item)
    if (error) throw error
  }

  const updateKnowledge = async (id: number, item: Partial<any>) => {
    const { error } = await client.from('knowledge_base').update(item).eq('id', id)
    if (error) throw error
  }

  const deleteKnowledge = async (id: number) => {
    const { error } = await client.from('knowledge_base').update({ is_deleted: true }).eq('id', id)
    if (error) throw error
  }

  // ============ 学习日记 ============
  const fetchDiary = async () => {
    const { data } = await client.from('study_diary')
      .select('*').neq('is_deleted', true)
      .order('entry_date', { ascending: false })
    return data || []
  }

  const saveDiary = async (item: Partial<any>) => {
    const { error } = await client.from('study_diary').insert(item)
    if (error) throw error
  }

  // ============ 备忘录 ============
  const fetchMemos = async () => {
    const { data } = await client.from('daily_memos')
      .select('*').neq('is_deleted', true)
      .order('memo_date', { ascending: false })
    return data || []
  }

  const fetchTodayMemos = async () => {
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await client.from('daily_memos')
      .select('*')
      .eq('memo_date', today)
      .neq('is_deleted', true)
    return data || []
  }

  const toggleMemo = async (id: number, isDone: boolean) => {
    const { error } = await client.from('daily_memos').update({ is_done: !isDone }).eq('id', id)
    if (error) throw error
  }

  const saveMemo = async (item: Partial<any>) => {
    const { error } = await client.from('daily_memos').insert(item)
    if (error) throw error
  }

  // ============ 闪卡 ============
  const fetchFlashcards = async () => {
    const { data: cards } = await client.from('flashcards')
      .select('*').neq('is_deleted', true)
      .order('created_at', { ascending: false })
    if (!cards?.length) return []

    // Join with latest review
    const { data: reviews } = await client.from('flashcard_reviews')
      .select('*').order('reviewed_at', { ascending: false }).limit(1000)

    const reviewMap: Record<string, any> = {}
    reviews?.forEach((r: any) => {
      if (!reviewMap[r.flashcard_id]) reviewMap[r.flashcard_id] = r
    })

    return cards.map((c: any) => ({
      ...c,
      ...(reviewMap[c.id] || {}),
      last_reviewed: reviewMap[c.id]?.reviewed_at || null
    }))
  }

  const fetchDueFlashcards = async () => {
    const all = await fetchFlashcards()
    return all.filter((f: any) =>
      !f.next_review_at || new Date(f.next_review_at) <= new Date()
    )
  }

  const saveFlashcard = async (item: Partial<any>) => {
    const { error } = await client.from('flashcards').insert(item)
    if (error) throw error
  }

  const saveFlashcardReview = async (item: Partial<any>) => {
    const { error } = await client.from('flashcard_reviews').insert(item)
    if (error) throw error
  }

  // ============ 番茄钟 ============
  const fetchTodaySessions = async () => {
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await client.from('study_sessions').select('*').eq('session_date', today)
    return data || []
  }

  const saveSession = async (item: Partial<any>) => {
    const { error } = await client.from('study_sessions').insert(item)
    if (error) throw error
  }

  // ============ 收藏 ============
  const fetchBookmarks = async () => {
    const { data } = await client.from('bookmarks')
      .select('*').neq('is_deleted', true)
      .order('created_at', { ascending: false })
    return data || []
  }

  const saveBookmark = async (item: Partial<any>) => {
    const { error } = await client.from('bookmarks').insert(item)
    if (error) throw error
  }

  // ============ 统计 ============
  const fetchStats = async () => {
    const today = new Date().toISOString().slice(0, 10)

    const [{ count: kb }, { count: diary }, { count: memos },
           dueCards, sessions] = await Promise.all([
      client.from('knowledge_base').select('*', { count: 'exact', head: true }).neq('is_deleted', true),
      client.from('study_diary').select('*', { count: 'exact', head: true }).neq('is_deleted', true),
      client.from('daily_memos').select('*', { count: 'exact', head: true }).eq('memo_date', today).neq('is_deleted', true),
      fetchDueFlashcards(),
      fetchTodaySessions()
    ])

    return {
      knowledge: kb || 0,
      diary: diary || 0,
      todayMemos: memos || 0,
      srsDue: dueCards.length,
      pomoToday: sessions.reduce((s: number, r: any) => s + (r.pomodoro_count || 0), 0),
      pomoMinutes: sessions.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0)
    }
  }

  // ============ 连续打卡 ============
  const fetchStreak = async () => {
    const { data } = await client.from('study_diary')
      .select('entry_date').neq('is_deleted', true)
      .order('entry_date', { ascending: false }).limit(100)
    if (!data?.length) return 0

    const dates = [...new Set(data.map((d: any) => d.entry_date))].sort().reverse()
    let count = 0
    const today = new Date().toISOString().slice(0, 10)
    const checkDate = new Date(dates[0] === today ? today : new Date(Date.now() - 86400000))

    while (count < dates.length) {
      const ds = checkDate.toISOString().slice(0, 10)
      if (dates.includes(ds)) { count++; checkDate.setDate(checkDate.getDate() - 1) }
      else break
    }
    return count
  }

  return {
    fetchKnowledge, saveKnowledge, updateKnowledge, deleteKnowledge,
    fetchDiary, saveDiary,
    fetchMemos, fetchTodayMemos, toggleMemo, saveMemo,
    fetchFlashcards, fetchDueFlashcards, saveFlashcard, saveFlashcardReview,
    fetchTodaySessions, saveSession,
    fetchBookmarks, saveBookmark,
    fetchStats, fetchStreak
  }
}
