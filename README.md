## Book Inventory Management System

This project is a simple book inventory management application built with React and Bootstrap on the front end and a lightweight Node.js/Express server for local persistence.  
It fetches initial sample data from the public JSONPlaceholder API and stores any books you create or edit in a local JSON file so your data survives browser refreshes and machine restarts.

---

## Features

- View a paginated list of books (5 per page).
- See initial demo data fetched from `https://jsonplaceholder.typicode.com/posts` (first 5 records).
- Add new books with title and author.
- Persist new books in `server/localBooks.json` so they are not lost on refresh.
- Edit and delete books that were added locally.
- View book details on a dedicated page, with a back button that returns you to the same list page.
- Pagination that automatically adjusts when items are deleted (for example, deleting the only item on page 2 takes you back to page 1).

---

## Project structure (high level)

- `src/`
  - `App.js` – main routing and layout.
  - `components/`
    - `Header.jsx`, `Footer.jsx` – layout chrome.
    - `BookTable.jsx` – table with pagination, inline edit for local books, and actions.
    - `BookForm.jsx` – Add Book page and form.
  - `pages/`
    - `HomePage.jsx` – home page showing the table of books.
    - `BookDetails.jsx` – details view with back navigation.
  - `services/`
    - `bookService.js` – all API calls (remote JSONPlaceholder + local Node server).
  - `styles/style.css` – additional styling.
- `server/`
  - `index.js` – small Express server for local book persistence.
  - `localBooks.json` – JSON file where locally added books are stored.

---

## Prerequisites

- Node.js (LTS version is recommended).
- npm (installed with Node).

To verify:

```bash
node -v
npm -v
```

---

## Installation

1. Clone or download this repository.
2. In a terminal, move into the project folder:

```bash
cd book-inventory
```

3. Install dependencies:

```bash
npm install
```

This installs both the React app dependencies and the backend server dependencies (Express, CORS, etc.).

---

## Running the project in development

The project uses **two processes** in development:

- React development server (front end) on `http://localhost:3000`
- Local books API server (back end) on `http://localhost:5001`

### 1. Start the local books API server

In the project root:

```bash
npm run server
```

You should see a log similar to:

```text
Local books API running on port 5001
```

Keep this process running while you use the app.

### 2. Start the React app

Open a second terminal in the same project folder and run:

```bash
npm start
```

This starts the React development server on `http://localhost:3000`.  
The browser should open automatically; if not, open it manually.

---

## How data works

When the app loads:

1. `bookService.getBooks()` calls:
   - `GET https://jsonplaceholder.typicode.com/posts?_limit=5` for the first 5 demo books.
   - `GET http://localhost:5001/local-books` to load all books from `server/localBooks.json`.
2. The two lists are combined in this order:
   - API books first.
   - Locally stored books from `localBooks.json` after that.

When operations are performed:

- **Add book**
  - The Add Book form calls `bookService.addBook()`.
  - This sends `POST http://localhost:5001/local-books` with `title` and `author`.
  - The server assigns a new `id` (starting from 6) and writes the book into `server/localBooks.json`.

- **Edit local book**
  - For locally added books, inline edit in the table calls `bookService.updateBook(id, updates)`.
  - This sends `PUT http://localhost:5001/local-books/:id` and updates the record in `localBooks.json`.

- **Delete local book**
  - Deleting a local book sends `DELETE http://localhost:5001/local-books/:id`.
  - The server removes the record from `localBooks.json`.

- **Edit/delete initial API books**
  - For the initial demo entries (ids from JSONPlaceholder), `updateBook` and `deleteBook` fall back to the JSONPlaceholder API.
  - These are for demo purposes only; the remote API is not actually persisted and may not reflect your changes permanently.

Because locally added books are stored in `server/localBooks.json`, they are available again after:

- Refreshing the browser.
- Restarting the React dev server.
- Restarting the machine (as long as the file remains).

---

## Resetting local data

If you want to clear all locally added books and start fresh, you can:

1. Stop the local server if it is running.
2. Open `server/localBooks.json`.
3. Replace its contents with:

```json
[]
```

4. Save the file and restart `npm run server` and `npm start`.

---

## Building for production

To create an optimized production build of the React app:

```bash
npm run build
```

The compiled assets will be written to the `build` directory.  
For production use, you would typically serve the `build` folder behind a static file server and run the Node server (or another backend) separately to handle data persistence.

=======
