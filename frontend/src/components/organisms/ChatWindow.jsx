import React, { useRef, useEffect } from 'react'
import MessageBubble from '../molecules/MessageBubble.jsx'
import Loader from '../atoms/Loader.jsx'

function ChatWindow({ messages, isLoading }) {
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    return (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto gap-1">
            {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg.text} sender={msg.sender} />
            ))}
            {isLoading && <Loader />}
            <div ref={bottomRef} />
        </div>
    )
}

export default ChatWindow
