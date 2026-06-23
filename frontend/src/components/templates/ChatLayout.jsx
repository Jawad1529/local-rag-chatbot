import React from 'react'

function ChatLayout({ children }) {
    return (
        <div className="h-screen flex flex-col bg-slate-950">
            <header className="p-4 bg-slate-900 border-b border-slate-700">
                <h1 className="text-lg text-slate-100 font-semibold">Local RAG Chatbot</h1>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    )
}

export default ChatLayout
