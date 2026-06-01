<template>
  <div class="space-y-6">
    <!-- Top 10 Must-Read -->
    <UCard>
      <template #header>
        <h3 class="font-bold text-lg">🔴 必读10本（读透够用）</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div v-for="(book, i) in top10" :key="i" class="flex gap-2 items-start p-2 rounded hover:bg-(--ui-bg-elevated)">
          <span class="font-bold text-(--ui-primary) min-w-6">{{ i + 1 }}.</span>
          <div>
            <span class="font-medium">{{ book.title }}</span>
            <span class="text-(--ui-text-muted)"> — {{ book.desc }}</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- 4-Week Action Plan -->
    <UCard>
      <template #header>
        <h3 class="font-bold text-lg">🗺️ 四周实操方案</h3>
      </template>
      <div class="space-y-3">
        <div v-for="week in weeks" :key="week.num" class="flex gap-3 p-3 rounded-lg" :class="week.bg">
          <div class="text-2xl min-w-10 text-center">{{ week.icon }}</div>
          <div>
            <div class="font-bold">{{ week.title }}</div>
            <div class="text-sm text-(--ui-text-muted)">{{ week.tasks }}</div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- 10 Lessons -->
    <UCard>
      <template #header>
        <h3 class="font-bold text-lg">🎯 十条终极建议</h3>
      </template>
      <div class="space-y-3">
        <div v-for="(lesson, i) in lessons" :key="i" class="flex gap-3 items-start p-2">
          <UBadge :color="i % 2 === 0 ? 'error' : 'primary'" variant="subtle" size="sm" class="mt-0.5">{{ i + 1 }}</UBadge>
          <div class="text-sm">
            <strong>{{ lesson.title }}</strong>
            <span class="text-(--ui-text-muted)"> — {{ lesson.desc }}</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Key Trigrams -->
    <UCard>
      <template #header>
        <h3 class="font-bold text-lg">📊 38岁关键卦象速查</h3>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left p-2">卦名</th>
              <th class="text-left p-2">对应38岁状态</th>
              <th class="text-left p-2">核心启示</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trigram in trigrams" :key="trigram.name" class="border-b last:border-b-0">
              <td class="p-2 font-medium">{{ trigram.symbol }} {{ trigram.name }}</td>
              <td class="p-2 text-(--ui-text-muted)">{{ trigram.state }}</td>
              <td class="p-2">{{ trigram.lesson }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const top10 = [
  { title: '黄寿祺《周易译注》', desc: '最权威现代译注' },
  { title: '南怀瑾《易经杂说》', desc: '最好入门' },
  { title: '曾仕强《易经的智慧》', desc: '最接地气' },
  { title: '傅佩荣《乐天知命》', desc: '最好哲学视角' },
  { title: '朱熹《周易本义》', desc: '宋代理学基础' },
  { title: '王弼《周易注》', desc: '得意忘象，直抓本质' },
  { title: '程颐《周易程氏传》', desc: '时中智慧，中年人必读' },
  { title: '苏轼《东坡易传》', desc: '逆境中的通透' },
  { title: '王夫之《周易外传》', desc: '道在器中，哲学宝库' },
  { title: '杨万里《诚斋易传》', desc: '以史证易，最好懂的古人' },
]

const weeks = [
  { num: 1, icon: '📖', title: '第一周：建立框架', tasks: '读南怀瑾入门 → 学八卦含义 → 读懂乾坤二卦 → 找到自己处境的对应卦', bg: 'bg-(--ui-bg-elevated)' },
  { num: 2, icon: '🔍', title: '第二周：深度对齐', tasks: '选出3-5个相关卦 → 查多家注释对比 → 写「我的处境×易理」对照笔记', bg: '' },
  { num: 3, icon: '🎲', title: '第三周：决策辅助', tasks: '列出所有方向选项 → 用「时位应比」框架分析 → 可选起卦辅助 → 写决策笔记', bg: 'bg-(--ui-bg-elevated)' },
  { num: 4, icon: '🚀', title: '第四周：行动反馈', tasks: '确定最小可验证行动 → 执行 → 用复卦精神回顾得失 → 调整 → 循环往复', bg: '' },
]

const lessons = [
  { title: '你不是「还没找到」，你是「在找」', desc: '乾卦九三/九四：已经在路上，只是还没跃出水面' },
  { title: '方向不是「找到」的，是「走出来」的', desc: '坤卦：只要方向正直，不用反复练习也能向前' },
  { title: '「时」比「位」更重要', desc: '需卦：等待也是战略的一部分，不是浪费' },
  { title: '找到你的「比」', desc: '比卦：方向往往藏在人际关系里' },
  { title: '「困」是常态，不是失败', desc: '困卦：有时候是被「拥有太多」困住了' },
  { title: '真正的智慧是「得意忘象」', desc: '别死在「成功」的表面定义里' },
  { title: '「谦」是唯一全吉之卦', desc: '38岁最大的陷阱是骄傲，你不需要向谁证明' },
  { title: '「复」是宇宙的基本节奏', desc: '没有永远的冬天，低谷是高峰的前奏' },
  { title: '「革」要果断，「鼎」要稳重', desc: '方向调整是常态，建好就收才是错误' },
  { title: '你是你自己的「易」', desc: '学会在变化中自处，就是最终答案' },
]

const trigrams = [
  { symbol: '☰', name: '乾·九三', state: '终日乾乾，夕惕若厉', lesson: '你已经很努力了，继续就行' },
  { symbol: '☰', name: '乾·九四', state: '或跃在渊', lesson: '这是做决定的时刻' },
  { symbol: '☵', name: '屯', state: '万事开头难', lesson: '找到方向只是第一步' },
  { symbol: '☴', name: '需', state: '等待时机', lesson: '不是不作为，是蓄势' },
  { symbol: '☶', name: '大畜', state: '积德蓄力', lesson: '你的积累不会白费' },
  { symbol: '☱', name: '困', state: '困境中坚守', lesson: '困而不失其所亨' },
  { symbol: '☳', name: '革', state: '改弦更张', lesson: '该变的时候要果断' },
  { symbol: '🔥', name: '鼎', state: '除旧布新', lesson: '变完之后建立新秩序' },
]
</script>
