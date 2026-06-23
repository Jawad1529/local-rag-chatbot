import express from 'express'
import multer from 'multer'
import { chat, ingestDocument } from './rag.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(express.json())

app.post('/api/chat', async (req, res) => {
    try {
        const { query } = req.body
        const answer = await chat(query)
        res.json({ answer })
    } catch (err) {
        console.error(err)
        res.status(500).json({ answer: 'Something went wrong.' })
    }
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        await ingestDocument(req.file.originalname, req.file.buffer)
        res.json({ status: 'ok', filename: req.file.originalname })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to ingest document.' })
    }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
