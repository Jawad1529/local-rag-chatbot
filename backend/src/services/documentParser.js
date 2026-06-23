import pdf from 'pdf-parse'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { config } from '../config/index.js'

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.chunking.chunkSize,
    chunkOverlap: config.chunking.chunkOverlap,
})

export async function parseDocument(filename, buffer) {
    let text

    if (filename.endsWith('.pdf')) {
        const data = await pdf(buffer)
        text = data.text
    } else {
        text = buffer.toString('utf-8')
    }

    return await splitter.splitText(text)
}
