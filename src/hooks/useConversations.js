import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ascent-conversations'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(convos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos))
}

export function useConversations() {
  const [conversations, setConversations] = useState(load)

  // Persist on every change
  useEffect(() => { save(conversations) }, [conversations])

  const createConversation = useCallback((type = 'general', trek = null) => {
    const id = crypto.randomUUID()
    const convo = {
      id,
      type,           // 'general' | 'trek'
      title: 'New conversation',
      trekSlug: trek?.slug ?? null,
      trekName: trek?.name ?? null,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setConversations((prev) => [convo, ...prev])
    return id
  }, [])

  const addMessage = useCallback((id, message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const messages = [...c.messages, { ...message, ts: Date.now() }]
        // Auto-title from first user message
        const title =
          c.title === 'New conversation' && message.role === 'user'
            ? message.content.slice(0, 52) + (message.content.length > 52 ? '…' : '')
            : c.title
        return { ...c, messages, title, updatedAt: Date.now() }
      }),
    )
  }, [])

  const updateLastMessage = useCallback((id, content) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const messages = [...c.messages]
        if (messages.length && messages[messages.length - 1].role === 'assistant') {
          messages[messages.length - 1] = { ...messages[messages.length - 1], content }
        }
        return { ...c, messages, updatedAt: Date.now() }
      }),
    )
  }, [])

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clearAll = useCallback(() => setConversations([]), [])

  return {
    conversations,
    createConversation,
    addMessage,
    updateLastMessage,
    deleteConversation,
    clearAll,
  }
}
