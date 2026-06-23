import { Ollama } from '@langchain/community/llms/ollama'
import { config } from '../config/index.js'

export const llm = new Ollama({
    model: config.ollama.model,
    baseUrl: config.ollama.baseUrl,
})
