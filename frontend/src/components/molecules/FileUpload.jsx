import React, { useState, useRef } from 'react'
import Button from '../atoms/Button.jsx'
import FileIcon from '../atoms/FileIcon.jsx'

function FileUpload() {
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState(null)
    const inputRef = useRef(null)

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        setStatus(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (res.ok) {
                setStatus({ type: 'success', text: `Uploaded: ${data.filename}` })
            } else {
                setStatus({ type: 'error', text: data.error || 'Upload failed' })
            }
        } catch {
            setStatus({ type: 'error', text: 'Connection error' })
        } finally {
            setUploading(false)
            inputRef.current.value = ''
        }
    }

    return (
        <div className="flex items-center gap-3">
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.md,.txt"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
            />
            <Button onClick={() => inputRef.current.click()} disabled={uploading}>
                <span className="flex items-center gap-2">
                    <FileIcon />
                    {uploading ? 'Uploading...' : 'Upload Doc'}
                </span>
            </Button>
            {status && (
                <span className={`text-xs ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {status.text}
                </span>
            )}
        </div>
    )
}

export default FileUpload
