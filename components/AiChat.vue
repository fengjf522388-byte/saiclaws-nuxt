<template>
  <div>
    <!-- 悬浮按钮 -->
    <button
      @click="open = !open"
      class="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center text-xl hover:scale-105 transition-transform"
    >
      {{ open ? '✕' : '🐵' }}
    </button>

    <!-- 聊天面板 -->
    <Transition name="slide-up">
      <div v-if="open" class="fixed bottom-20 right-5 z-40 w-[380px] max-w-[90vw] h-[480px] max-h-[65vh] bg-(--ui-bg-elevated) border border-(--ui-border) rounded-xl shadow-2xl flex flex-col">
        <div class="flex items-center justify-between px-4 py-3 border-b border-(--ui-border)">
          <h3 class="font-bold text-(--ui-secondary)">🐵 悟空AI助手</h3>
          <UButton icon="i-lucide-x" variant="ghost" size="xs" @click="open = false" />
        </div>
        <div ref="chatBody" class="flex-1 overflow-y-auto p-4 space-y-3">
          <div class="text-sm text-(--ui-text-muted) bg-(--ui-primary)/10 rounded-lg p-3">
            👋 你好！我是悟空AI助手，专为CPA备考设计。<br>
            可以帮你解答会计、税法、经济法的问题。
          </div>
          <div v-for="(msg, i) in messages" :key="i"
            class="text-sm rounded-lg p-3 max-w-[85%]"
            :class="msg.role === 'user' ? 'bg-(--ui-primary) text-white ml-auto' : 'bg-(--ui-bg) border border-(--ui-border)'"
          >
            {{ msg.content }}
          </div>
          <div v-if="loading" class="text-sm text-(--ui-text-muted) animate-pulse">🐵 思考中...</div>
        </div>
        <div class="flex gap-2 p-3 border-t border-(--ui-border)">
          <UInput v-model="input" placeholder="问我CPA问题..." class="flex-1" @keyup.enter="send" :disabled="loading" />
          <UButton icon="i-lucide-send" @click="send" :disabled="loading || !input.trim()" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const open = ref(false)
const input = ref('')
const messages = ref<{ role: string; content: string }[]>([])
const loading = ref(false)
const chatBody = ref<HTMLElement>()

const EDGE_URL = 'https://lwoqjahqneosnummjlbo.supabase.co/functions/v1/ai_chat'

const send = async () => {
  const msg = input.value.trim()
  if (!msg) return
  messages.value.push({ role: 'user', content: msg })
  input.value = ''
  loading.value = true

  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight

  try {
    const res = await $fetch(EDGE_URL, {
      method: 'POST',
      body: { message: msg }
    })
    messages.value.push({ role: 'bot', content: res.reply || '🐵 抱歉，暂时无法回复' })
  } catch {
    messages.value.push({ role: 'bot', content: '🐵 连接失败，请检查网络' })
  }
  loading.value = false

  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(10px); }
</style>
