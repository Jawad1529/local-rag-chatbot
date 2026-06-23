import { parseDocument } from '../services/documentParser.js'
import { storeChunks } from '../services/vectorStore.js'

export async function handleUpload(req, res) {
    try {
        const { originalname, buffer } = req.file
        const chunks = await parseDocument(originalname, buffer)
        await storeChunks(chunks, { source: originalname })

        res.json({ status: 'ok', filename: originalname })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to ingest document.' })
    }
}
