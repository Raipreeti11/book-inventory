import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function BookTable({ books, onDelete, onEdit }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(books.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = books.slice(startIndex, startIndex + itemsPerPage);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSearchParams({ page: String(page) });
  };

  // When the total number of books shrinks (e.g. delete last item on last page),
  // make sure currentPage is still valid. If not, move back to the last valid page.
  useEffect(() => {
    const newTotalPages =
      Math.ceil(books.length / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      const newPage = newTotalPages;
      setCurrentPage(newPage);
      setSearchParams({ page: String(newPage) });
    }
  }, [books.length, itemsPerPage, currentPage, setSearchParams]);

  const startEdit = (book) => {
    setEditingId(book.id);
    setEditTitle(book.title || "");
    setEditAuthor(book.author || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditAuthor("");
  };

  const saveEdit = () => {
    if (!editingId || !editTitle.trim() || !editAuthor.trim()) return;
    onEdit(editingId, { title: editTitle, author: editAuthor });
    cancelEdit();
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Book Name</th>
            <th>Author Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentBooks.map((book) => {
            const isEditing = editingId === book.id;
            const isLocal = book.isLocal;

            return (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                    />
                  ) : (
                    book.author || `User ${book.userId}`
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/book/${book.id}?page=${currentPage}`}
                        className="btn btn-info btn-sm me-2"
                      >
                        View
                      </Link>
                      {isLocal && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => startEdit(book)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(book.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {books.length > itemsPerPage && (
        <nav aria-label="Book table pagination" className="mt-3">
          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>

            <span className="text-muted small text-center">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-outline-primary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default BookTable;
