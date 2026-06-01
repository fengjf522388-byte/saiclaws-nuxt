<template>
  <div class="space-y-4">
    <UCard v-for="item in items" :key="item.title">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold">{{ item.title }}</span>
          <UBadge :color="item.stars >= 5 ? 'error' : 'warning'" variant="subtle" size="sm">
            {{ '⭐'.repeat(item.stars) }}
          </UBadge>
        </div>
      </template>
      <p class="text-sm text-(--ui-text-muted) mb-2">{{ item.author }} · {{ item.type }}</p>
      <p class="text-sm">{{ item.insight }}</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    title: '曾仕强「中国式管理」系列',
    author: '现代·曾仕强',
    type: '管理哲学',
    stars: 5,
    insight: '西方管理是「术」，中国式管理是「道」。「修己安人」——先管好自己，再管别人。38岁如果还没找到方向，可能是因为你一直在「管别人」（迎合外界期待），而忽略了「修己」（了解自己）。「合理就好」——不是找最好的方向，是找最适合自己的方向。'
  },
  {
    title: '荣格《易经英译本序言》及共时性理论',
    author: '瑞士·C.G.Jung',
    type: '分析心理学',
    stars: 5,
    insight: '荣格的「共时性」（有意义的巧合）直接源于易经研究。核心启发：你之所以迷茫，可能是因为只用「因果逻辑」思考问题。回想一下——哪些看起来偶然的事件让你走到了今天？那些「偶然」里可能藏着你的方向。荣格的「积极想象」和易经占筮同构——让你的潜意识信息浮现到意识层面。38岁的困惑，意识找不到答案，但潜意识可能早就知道。'
  },
  {
    title: '卫礼贤《The I Ching or Book of Changes》',
    author: '德·Richard Wilhelm',
    type: '西方经典译本',
    stars: 5,
    insight: '西方世界最权威的易经译本，由荣格作序。独特价值：换个语言换个思维——中文读「元亨利贞」觉得玄乎，英文读「Supreme success. Perseverance furthers.」突然就清晰了。荣格的序言是理解易经和现代心理学连接的必读文章。'
  },
  {
    title: '傅佩荣《傅佩荣讲易经》（2025版）',
    author: '现代·傅佩荣',
    type: '集大成之作',
    stars: 5,
    insight: '五十周年力作，豆瓣9.5分。以「穷、变、通、久」为纲，系统解构64卦384爻的深层逻辑。核心解卦方法：「时」「位」「应」「比」四维分析——时间、位置、呼应关系、靠近资源，四点搞清楚，方向自然出来。'
  },
  {
    title: '易经与中医养生',
    author: '跨学科',
    type: '身心一体',
    stars: 4,
    insight: '中医理论直接建立在阴阳五行基础上。38岁的独特价值：身心一体——身体出问题会影响决策质量。「治未病」的思维——不等生病再治，不等被裁再想方向。阴阳平衡——38岁最容易失衡：拼命工作忽视健康、追求事业忽略家庭。'
  },
  {
    title: '易经与科学（莱布尼茨/量子物理/系统论）',
    author: '跨学科',
    type: '科学与易',
    stars: 4,
    insight: '莱布尼茨发现八卦对应二进制。混沌理论「蝴蝶效应」：微小差异导致巨大结果差异——不要等着一个「重大决定」来改变人生，每天做的微小选择才是真正塑造你方向的力量。量子思维：没有「唯一正确的方向」，只有「概率更高的方向」。'
  },
]
</script>
