import React from 'react'

function Loader() {
    return (
        <div className="flex gap-1 p-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
        </div>
    )
}

export default Loader
