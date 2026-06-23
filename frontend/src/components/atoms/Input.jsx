import React from 'react'

function Input({ value, onChange, placeholder, onKeyDown }) {
    return (
        <input
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
        />
    )
}

export default Input
