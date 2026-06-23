import { Router } from 'express'
import multer from 'multer'
import { handleChat } from '../controllers/chatController.js'
import { handleUpload } from '../controllers/uploadController.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/chat', handleChat)
router.post('/upload', upload.single('file'), handleUpload)

export default router
