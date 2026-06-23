import { Chroma } from '@langchain/community/vectorstores/chroma'
import { embeddings } from './embeddings.js'
import { config } from '../config/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PERSIST_DIR = path.resolve(__dirname, '../../chroma_data')

export async function getVectorStore() {
    return await Chroma.fromExistingCollection(embeddings, {
        collectionName: config.chroma.collection,
        collectionMetadata: { 'hnsw:space': 'cosine' },
        persistDirectory: PERSIST_DIR,
    })
}

export async function storeChunks(chunks, metadata) {
    await Chroma.fromTexts(
        chunks,
        chunks.map(() => metadata),
        embeddings,
        {
            collectionName: config.chroma.collection,
            persistDirectory: PERSIST_DIR,
        }
    )
}
