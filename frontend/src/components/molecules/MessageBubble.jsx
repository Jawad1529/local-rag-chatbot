import React from 'react'

function MessageBubble({ message, sender }) {
    const isUser = sender === 'user'

    return (
        <div className={`max-w-[70%] px-4 py-2 rounded-xl mb-2 ${isUser ? 'self-end bg-indigo-600 text-white' : 'self-start bg-slate-800 text-slate-100'}`}>
            <span className="text-xs opacity-70 block mb-1">{isUser ? 'You' : 'Bot'}</span>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
    )
}

export default MessageBubble
