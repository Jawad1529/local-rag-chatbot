# Local RAG Chatbot - Complete Project Guide

## What Is This Project?

A chatbot that runs 100% on your machine (no API keys, no cloud). You upload your own documents (PDFs, text files, markdown), and then ask questions about them. The AI reads your docs and answers based on what's in them.

This is called **RAG** — Retrieval Augmented Generation.

---

## How RAG Works (Simple Explanation)

Imagine you have a 100-page textbook. Instead of feeding the entire book to an AI every time you ask a question, you:

1. **Chop** the book into small paragraphs (chunks)
2. **Convert** each chunk into numbers (embeddings) that represent its meaning
3. **Store** those numbers in a searchable database (vector store)
4. When you ask a question, **convert your question** into numbers too
5. **Find** the 3 most similar chunks to your question
6. **Send** those chunks + your question to the AI
7. AI answers using only the relevant context

This is way more efficient and accurate than sending everything at once.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite + Tailwind | Chat UI |
| Backend | Node.js + Express | API server |
| AI Framework | LangChain | Orchestrates the RAG pipeline |
| LLM | Ollama (llama3) | Generates answers locally |
| Embeddings | Ollama (nomic-embed-text) | Converts text to vectors |
| Vector Store | LangChain MemoryVectorStore | Stores and searches embeddings |
| File Parsing | pdf-parse | Extracts text from PDFs |

---

## Project Structure

```
frontend/                         (React + Vite + Tailwind)
├── src/
│   ├── components/
│   │   ├── atoms/                ← Smallest UI pieces
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── FileIcon.jsx
│   │   │   └── ResetButton.jsx
│   │   ├── molecules/            ← Combinations of atoms
│   │   │   ├── ChatInput.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── organisms/            ← Complex sections
│   │   │   └── ChatWindow.jsx
│   │   ├── templates/            ← Page layouts
│   │   │   └── ChatLayout.jsx
│   │   └── pages/                ← Route-level pages
│   │       └── ChatPage.jsx
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js

backend/                          (Node.js + Express)
├── src/
│   ├── config/
│   │   └── index.js              ← All configuration
│   ├── controllers/
│   │   ├── chatController.js     ← Handles chat requests
│   │   └── uploadController.js   ← Handles file uploads
│   ├── routes/
│   │   └── index.js              ← API route definitions
│   ├── services/
│   │   ├── documentParser.js     ← PDF/text parsing + chunking
│   │   ├── embeddings.js         ← Embedding model instance
│   │   ├── llm.js                ← LLM instance
│   │   └── vectorStore.js        ← Vector store (save/load/search)
│   ├── app.js                    ← Express app setup
│   └── index.js                  ← Entry point
├── test/data/                    ← Dummy file for pdf-parse bug
├── vector_store.json             ← Persisted embeddings (auto-generated)
└── package.json
```

---

## Key Concepts Explained

### 1. Embeddings

Text converted into a list of numbers (a vector like `[0.12, -0.45, 0.78, ...]`). Similar meanings produce similar numbers. "dog" and "puppy" will have vectors close to each other. "dog" and "airplane" will be far apart.

We use `nomic-embed-text` for this — a small, fast model designed specifically for embeddings.

### 2. Vector Store

A database optimized for finding similar vectors. When you search, it compares your query's vector against all stored vectors and returns the closest matches.

We use `MemoryVectorStore` — stores everything in RAM and persists to a JSON file.

### 3. Chunking

Documents are split into smaller pieces (1000 characters with 200 character overlap). Why?
- LLMs have limited context windows
- Smaller chunks = more precise retrieval
- Overlap ensures we don't cut sentences in half

### 4. LLM (Large Language Model)

`llama3` running locally via Ollama. It takes the retrieved chunks + your question and generates a natural language answer.

### 5. Atomic Design (Frontend)

A methodology for building UI:
- **Atoms**: Smallest units (Button, Input, Loader)
- **Molecules**: Groups of atoms (ChatInput = Input + Button)
- **Organisms**: Complex sections (ChatWindow = many MessageBubbles + Loader)
- **Templates**: Page layouts (ChatLayout = header + main area)
- **Pages**: Actual pages combining everything (ChatPage)

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/chat | Send a question, get an answer |
| POST | /api/upload | Upload a document to the knowledge base |
| DELETE | /api/documents | Clear all uploaded documents |

### POST /api/chat
```json
// Request
{ "query": "What is the main topic of my document?" }

// Response
{ "answer": "Based on the uploaded documents, the main topic is..." }
```

### POST /api/upload
```
// Request: multipart/form-data with 'file' field
// Response
{ "status": "ok", "filename": "notes.pdf" }
```

### DELETE /api/documents
```json
// Response
{ "status": "ok", "message": "All documents cleared." }
```

---

## Data Flow

```
User types question
       ↓
Frontend sends POST /api/chat { query }
       ↓
Backend converts query → embedding (via nomic-embed-text)
       ↓
Vector store finds 3 most similar document chunks
       ↓
LangChain builds a prompt: "Answer based on this context: [chunks]. Question: [query]"
       ↓
Ollama (llama3) generates the answer
       ↓
Response sent back to frontend
       ↓
MessageBubble renders the answer
```

---

## Upload Flow

```
User selects a file
       ↓
Frontend sends POST /api/upload (multipart form)
       ↓
Multer stores file in memory (buffer)
       ↓
documentParser extracts text (pdf-parse for PDFs, toString for text)
       ↓
Text is split into chunks (1000 chars, 200 overlap)
       ↓
Each chunk batch (5 at a time) is embedded via nomic-embed-text
       ↓
Vectors + text stored in MemoryVectorStore
       ↓
Persisted to vector_store.json
```

---

## Lessons Learned

### 1. Ollama Model Types Matter
- **Chat models** (llama3, mistral) = generate text, answer questions
- **Embedding models** (nomic-embed-text) = convert text to vectors
- You can't use a chat model for embeddings — they're different APIs

### 2. pdf-parse Has a Bug
It tries to load a test PDF file on import. Workaround: lazy import (`await import('pdf-parse')`) or create the dummy file it expects.

### 3. Batch Embeddings
Sending 50 chunks at once to Ollama will overwhelm it. Process in batches of 5.

### 4. ChromaDB Needs Docker
If you want a production vector store, ChromaDB is great but needs Docker. For local dev, MemoryVectorStore is simpler.

### 5. Vite Proxy
Frontend runs on port 3000, backend on port 8000. Vite proxies `/api/*` calls to the backend so you don't hit CORS issues.

### 6. PATH Issues on Windows
After installing Ollama, you may need to restart your terminal for it to be found in PATH.

---

## Interview Questions & Answers

### Q: What is RAG and why do we need it?

**A:** RAG (Retrieval Augmented Generation) combines a retrieval system with a language model. Instead of relying on the LLM's training data alone, we retrieve relevant documents and include them in the prompt. This lets the AI answer questions about your specific data without fine-tuning.

### Q: What are embeddings?

**A:** Embeddings are numerical representations of text (vectors) where semantic similarity is preserved. Two sentences with similar meaning will have vectors that are mathematically close together, allowing us to do similarity search.

### Q: Why split documents into chunks?

**A:** Three reasons: (1) LLMs have limited context windows, (2) smaller chunks are more precise for retrieval — you get the exact relevant paragraph instead of an entire page, (3) embedding quality decreases with longer text.

### Q: What is a vector store?

**A:** A database designed for storing and querying high-dimensional vectors. It uses algorithms like cosine similarity or approximate nearest neighbors to efficiently find the most similar vectors to a query vector.

### Q: Explain the difference between an LLM and an embedding model.

**A:** An LLM (like llama3) generates text — it takes a prompt and produces a response. An embedding model (like nomic-embed-text) converts text into fixed-size numerical vectors for similarity comparison. Different architectures, different purposes.

### Q: What is LangChain?

**A:** LangChain is a framework that provides abstractions for building LLM applications. It handles chains (sequences of LLM calls), retrieval, memory, and integrations with various models and vector stores so you don't write boilerplate.

### Q: Why use chunking overlap?

**A:** Overlap (e.g., 200 characters) ensures that if a sentence spans two chunks, it appears in full in at least one of them. Without overlap, you might split mid-sentence and lose context.

### Q: What is Atomic Design?

**A:** A frontend methodology that organizes components into 5 levels: Atoms (basic elements), Molecules (groups of atoms), Organisms (complex sections), Templates (page layouts), Pages (instances of templates with real content). It promotes reusability and consistency.

### Q: How does the vector similarity search work?

**A:** When you ask a question, it's converted to a vector. Then the system calculates the cosine similarity (or distance) between your query vector and every stored vector. The top-k (usually 3) most similar chunks are returned as context for the LLM.

### Q: What is cosine similarity?

**A:** A measure of how similar two vectors are, regardless of their magnitude. It calculates the cosine of the angle between them. A value of 1 means identical direction (very similar), 0 means perpendicular (unrelated), -1 means opposite.

### Q: Why run models locally with Ollama instead of using OpenAI API?

**A:** Privacy (data never leaves your machine), no API costs, no rate limits, no internet required, full control over the model. Trade-off: requires decent hardware and models may be less capable than GPT-4.

### Q: What is the RetrievalQA chain in LangChain?

**A:** A pre-built chain that combines retrieval + question answering. It takes a question, retrieves relevant documents from the vector store, stuffs them into a prompt, and sends it to the LLM. The "stuff" method puts all retrieved docs into one prompt.

### Q: How would you improve this RAG system?

**A:** (1) Better chunking strategies (semantic chunking by paragraphs), (2) Hybrid search (keyword + vector), (3) Re-ranking retrieved results, (4) Chat history/memory for follow-up questions, (5) Metadata filtering (search only specific docs), (6) Streaming responses for better UX.

### Q: What are the limitations of MemoryVectorStore?

**A:** Everything lives in RAM — won't scale to millions of documents. No built-in indexing (linear scan). For production, use Pinecone, Weaviate, ChromaDB, or pgvector.

---

## How to Run

```bash
# 1. Ollama must be installed and running
ollama pull llama3
ollama pull nomic-embed-text

# 2. Backend
cd backend
npm install
npm run dev

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev

# 4. Open http://localhost:3000
```

---

## Next Steps (What You Could Add)

- Streaming responses (show answer word by word)
- Chat history / conversation memory
- Drag-and-drop file upload
- Markdown rendering in bot responses
- Model switcher (llama3, mistral, etc.)
- Document list showing what's been uploaded
- Per-document delete
- Dark/light theme toggle
