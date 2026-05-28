// composables/useKeyboard.ts — 全局快捷键
export function useKeyboard() {
  const router = useRouter()

  // 快捷键映射：⌘+数字 = 跳转页面
  const shortcuts: Record<string, string> = {
    '1': '/',
    '2': '/today',
    '3': '/flashcards',
    '4': '/knowledge',
    '5': '/diary',
    '6': '/memos',
    '7': '/pomodoro',
    '8': '/bookmarks',
  }

  onMounted(() => {
    window.addEventListener('keydown', handler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handler)
  })

  function handler(e: KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey
    // ⌘K 搜素在 layout 里处理
    if (mod && shortcuts[e.key]) {
      e.preventDefault()
      router.push(shortcuts[e.key])
    }
  }
}
