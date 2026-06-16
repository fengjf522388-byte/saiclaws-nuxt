-- study_records 表 — 学习记录·记忆胶囊
-- 在 Supabase SQL Editor 中执行此脚本

CREATE TABLE IF NOT EXISTS study_records (
  id              SERIAL PRIMARY KEY,
  subject         TEXT NOT NULL,            -- '会计' | '税法' | '经济法'
  chapter_no      INTEGER NOT NULL,         -- 章节号
  chapter_name    TEXT NOT NULL,            -- 章节名称
  title           TEXT NOT NULL,            -- 记录标题
  content         TEXT,                     -- 学习笔记内容
  key_takeaways   TEXT[] DEFAULT '{}',      -- 关键收获列表
  difficulty_rating INTEGER DEFAULT 1,     -- 难度 1-5
  study_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  study_minutes   INTEGER DEFAULT 0,       -- 学习时长（分钟）
  tags            TEXT[] DEFAULT '{}',      -- 标签
  is_deleted      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_study_records_subject ON study_records(subject) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_study_records_chapter ON study_records(subject, chapter_no) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_study_records_date ON study_records(study_date DESC) WHERE NOT is_deleted;

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_study_records_modified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_study_records_updated ON study_records;
CREATE TRIGGER trg_study_records_updated
  BEFORE UPDATE ON study_records
  FOR EACH ROW EXECUTE FUNCTION update_study_records_modified();

-- RLS 策略（如果启用了 RLS）
ALTER TABLE study_records ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（简单模式，适合个人应用）
CREATE POLICY "允许所有操作" ON study_records
  FOR ALL USING (true) WITH CHECK (true);
