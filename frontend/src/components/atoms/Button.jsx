import React from 'react'

function Button({ children, onClick, disabled = false }) {
    return (
        <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
