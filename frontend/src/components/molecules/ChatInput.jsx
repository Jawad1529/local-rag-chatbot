import React, { useState } from 'react'
import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'

function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState('')

    const handleSend = () => {
        if (text.trim()) {
            onSend(text.trim())
            setText('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend()
    }

    return (
        <div className="flex gap-2 p-4 border-t border-slate-700 bg-slate-900">
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask something about your docs..."
                onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSend} disabled={disabled || !text.trim()}>
                Send
            </Button>
        </div>
    )
}

export default ChatInput
