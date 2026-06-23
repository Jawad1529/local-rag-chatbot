import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { embeddings } from './embeddings.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STORE_PATH = path.resolve(__dirname, '../../vector_store.json')

let vectorStore = null

async function loadStore() {
    if (vectorStore) return vectorStore

    vectorStore = new MemoryVectorStore(embeddings)

    if (fs.existsSync(STORE_PATH)) {
        const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'))
        if (data.vectors && data.vectors.length > 0) {
            vectorStore.memoryVectors = data.vectors
        }
    }

    return vectorStore
}

function saveStore() {
    if (!vectorStore) return
    const data = { vectors: vectorStore.memoryVectors }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data))
}

export async function getVectorStore() {
    return await loadStore()
}

export async function clearStore() {
    vectorStore = new MemoryVectorStore(embeddings)
    if (fs.existsSync(STORE_PATH)) {
        fs.unlinkSync(STORE_PATH)
    }
}

export async function storeChunks(chunks, metadata) {
    const store = await loadStore()
    const batchSize = 5

    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize)
        await store.addDocuments(
            batch.map((text) => ({ pageContent: text, metadata }))
        )
    }

    saveStore()
}
