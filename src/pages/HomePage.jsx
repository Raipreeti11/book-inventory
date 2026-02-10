import { useEffect, useState } from "react";
import { getBooks, deleteBook, updateBook } from "../services/bookService";
import BookTable from "../components/BookTable";
import { Link } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    getBooks().then((res) => {
      setBooks(res.data);
    });
  };

  const handleDelete = (id) => {
    deleteBook(id).then(() => {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    });
  };

  const handleEdit = (id, updates) => {
    updateBook(id, updates).then((res) => {
      const updated = res.data;
      setBooks((prev) =>
        prev.map((book) => (book.id === id ? { ...book, ...updated } : book))
      );
    });
  };

  return (
    <div>
      <Link to="/add-book" className="btn btn-success mb-3">
        Add Book
      </Link>
      <BookTable books={books} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default Home;
