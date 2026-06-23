import { RetrievalQAChain } from 'langchain/chains'
import { llm } from '../services/llm.js'
import { getVectorStore } from '../services/vectorStore.js'

export async function handleChat(req, res) {
    try {
        const { query } = req.body

        let vectorStore
        try {
            vectorStore = await getVectorStore()
        } catch {
            return res.json({ answer: 'No documents uploaded yet. Please upload some docs first.' })
        }

        const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever({ k: 3 }))
        const result = await chain.invoke({ query })

        res.json({ answer: result.text })
    } catch (err) {
        console.error(err)
        res.status(500).json({ answer: 'Something went wrong.' })
    }
}
