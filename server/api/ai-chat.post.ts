// server/api/ai-chat.post.ts — POST /api/ai-chat
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const res = await $fetch('https://lwoqjahqneosnummjlbo.supabase.co/functions/v1/ai_chat', {
    method: 'POST',
    body: { message: body.message }
  })
  
  return res
})
