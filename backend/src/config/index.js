export const config = {
    port: process.env.PORT || 8000,
    ollama: {
        model: process.env.OLLAMA_MODEL || 'llama3',
        baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
    },
    chroma: {
        collection: process.env.CHROMA_COLLECTION || 'docs',
    },
    chunking: {
        chunkSize: 1000,
        chunkOverlap: 200,
    },
}
