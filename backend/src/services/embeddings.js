import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { config } from '../config/index.js'

export const embeddings = new OllamaEmbeddings({
    model: config.ollama.embeddingModel,
    baseUrl: config.ollama.baseUrl,
    requestOptions: { timeout: 60000 },
})
