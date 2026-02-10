const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const DATA_FILE = path.join(__dirname, "localBooks.json");
const MIN_LOCAL_ID = 6; // API is limited to 5 items (ids 1-5)

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readBooks() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBooks(books) {
  await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), "utf8");
}

function nextId(books) {
  const max = books.reduce((acc, b) => {
    const id = Number(b?.id);
    return Number.isFinite(id) ? Math.max(acc, id) : acc;
  }, MIN_LOCAL_ID - 1);
  return Math.max(max + 1, MIN_LOCAL_ID);
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/local-books", async (_req, res) => {
  const books = await readBooks();
  res.json(books);
});

app.get("/local-books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const books = await readBooks();
  const book = books.find((b) => Number(b.id) === id);
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
});

app.post("/local-books", async (req, res) => {
  const { title, author, body } = req.body || {};
  if (!title || !author) {
    return res.status(400).json({ message: "title and author are required" });
  }

  const books = await readBooks();
  const book = {
    id: nextId(books),
    title: String(title),
    author: String(author),
    body: body != null ? String(body) : "",
    isLocal: true,
  };
  books.push(book);
  await writeBooks(books);
  res.status(201).json(book);
});

app.put("/local-books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, author, body } = req.body || {};

  const books = await readBooks();
  const idx = books.findIndex((b) => Number(b.id) === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  const prev = books[idx];
  const updated = {
    ...prev,
    ...(title != null ? { title: String(title) } : null),
    ...(author != null ? { author: String(author) } : null),
    ...(body != null ? { body: String(body) } : null),
    isLocal: true,
  };
  books[idx] = updated;
  await writeBooks(books);
  res.json(updated);
});

app.delete("/local-books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const books = await readBooks();
  const idx = books.findIndex((b) => Number(b.id) === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  books.splice(idx, 1);
  await writeBooks(books);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Local books API running on port ${PORT}`);
});

