import React, { useState } from 'react'

function ResetButton() {
    const [clearing, setClearing] = useState(false)

    const handleReset = async () => {
        if (!confirm('Clear all uploaded documents?')) return
        setClearing(true)
        try {
            await fetch('/api/documents', { method: 'DELETE' })
        } catch {
            // ignore
        } finally {
            setClearing(false)
        }
    }

    return (
        <button
            onClick={handleReset}
            disabled={clearing}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
        >
            {clearing ? 'Clearing...' : 'Reset Docs'}
        </button>
    )
}

export default ResetButton
