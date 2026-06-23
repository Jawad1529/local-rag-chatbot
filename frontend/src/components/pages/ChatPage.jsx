import React, { useState } from 'react'
import ChatLayout from '../templates/ChatLayout.jsx'
import ChatWindow from '../organisms/ChatWindow.jsx'
import ChatInput from '../molecules/ChatInput.jsx'

function ChatPage() {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async (text) => {
        setMessages((prev) => [...prev, { text, sender: 'user' }])
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text })
            })
            const data = await res.json()
            setMessages((prev) => [...prev, { text: data.answer, sender: 'bot' }])
        } catch {
            setMessages((prev) => [...prev, { text: 'Error connecting to server.', sender: 'bot' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ChatLayout>
            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput onSend={handleSend} disabled={isLoading} />
        </ChatLayout>
    )
}

export default ChatPage
