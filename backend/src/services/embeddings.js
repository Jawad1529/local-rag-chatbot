import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { config } from '../config/index.js'

export const embeddings = new OllamaEmbeddings({
    model: config.ollama.model,
    baseUrl: config.ollama.baseUrl,
})
