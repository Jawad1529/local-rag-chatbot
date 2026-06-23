import { Router } from 'express'
import multer from 'multer'
import { handleChat } from '../controllers/chatController.js'
import { handleUpload } from '../controllers/uploadController.js'
import { clearStore } from '../services/vectorStore.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/chat', handleChat)
router.post('/upload', upload.single('file'), handleUpload)
router.delete('/documents', async (req, res) => {
    await clearStore()
    res.json({ status: 'ok', message: 'All documents cleared.' })
})

export default router
