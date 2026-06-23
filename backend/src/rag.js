import { Ollama } from '@langchain/community/llms/ollama'
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { RetrievalQAChain } from 'langchain/chains'
import pdf from 'pdf-parse'

const MODEL_NAME = 'llama3'
const CHROMA_URL = 'http://localhost:8001'
const COLLECTION_NAME = 'docs'

const llm = new Ollama({ model: MODEL_NAME })
const embeddings = new OllamaEmbeddings({ model: MODEL_NAME })

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
})

async function getVectorStore() {
    return await Chroma.fromExistingCollection(embeddings, {
        collectionName: COLLECTION_NAME,
        url: CHROMA_URL,
    })
}

export async function ingestDocument(filename, buffer) {
    let text

    if (filename.endsWith('.pdf')) {
        const data = await pdf(buffer)
        text = data.text
    } else {
        text = buffer.toString('utf-8')
    }

    const chunks = await splitter.splitText(text)

    await Chroma.fromTexts(chunks, chunks.map(() => ({ source: filename })), embeddings, {
        collectionName: COLLECTION_NAME,
        url: CHROMA_URL,
    })
}

export async function chat(query) {
    let vectorStore
    try {
        vectorStore = await getVectorStore()
    } catch {
        return 'No documents uploaded yet. Please upload some docs first.'
    }

    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever({ k: 3 }))
    const result = await chain.invoke({ query })
    return result.text
}
