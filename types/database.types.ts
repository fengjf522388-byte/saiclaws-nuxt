// types/database.types.ts — Supabase 数据库类型定义
// 与 Supabase 项目 lwoqjahqneosnummjlbo 的表结构对应

export interface KnowledgeBase {
  id: number
  subject: string           // '会计' | '税法' | '经济法'
  chapter_no: number
  chapter_name: string
  topic_name: string
  content: string | null
  syllabus_level: number    // 1=了解 2=理解 3=掌握
  key_points: string[] | null
  common_mistakes: string | null
  exam_years: string | null
  mastery_level: number     // 掌握度 0-5
  is_deleted: boolean
  created_at: string
}

export interface StudyDiary {
  id: number
  entry_date: string
  subject: string
  chapter_name: string | null
  oral_transcript: string | null
  ai_summary: string | null
  missing_points: string | null
  mastery_score: number | null
  study_minutes: number
  is_deleted: boolean
  is_published: boolean
  created_at: string
}

export interface DailyMemo {
  id: number
  content: string
  memo_date: string
  priority: 'high' | 'medium' | 'low' | null
  is_done: boolean
  is_deleted: boolean
  created_at: string
}

export interface Flashcard {
  id: string
  knowledge_id: number | null
  subject: string | null
  question: string
  answer: string
  source_type: 'manual' | 'ai_generated' | 'oral_eval'
  is_deleted: boolean
  created_at: string
  // Joined from flashcard_reviews
  next_review_at?: string | null
  interval_days?: number
  ease_factor?: number
  repetitions?: number
  quality?: number
}

export interface FlashcardReview {
  id: string
  flashcard_id: string
  quality: number
  reviewed_at: string
  next_review_at: string
  interval_days: number
  ease_factor: number
  repetitions: number
}

export interface StudySession {
  id: string
  session_date: string
  subject: string | null
  duration_minutes: number
  pomodoro_count: number
  notes: string | null
  created_at: string
}

export interface Bookmark {
  id: string
  url: string
  title: string | null
  summary: string | null
  tags: string[]
  subject: string | null
  is_deleted: boolean
  created_at: string
}

export interface StudyRecord {
  id: number
  subject: string           // '会计' | '税法' | '经济法'
  chapter_no: number
  chapter_name: string
  title: string
  content: string | null
  key_takeaways: string[] | null
  difficulty_rating: number  // 1-5
  study_date: string
  study_minutes: number
  tags: string[] | null
  is_deleted: boolean
  created_at: string
  updated_at: string
}
