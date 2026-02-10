import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../services/bookService";

function BookForm() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    // Book name validation
    if (!bookName.trim()) {
      formErrors.bookName = "Book name is required";
    }

    // Author name validation
    if (!authorName.trim()) {
      formErrors.authorName = "Author name is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    // Create new book object; id will be assigned in the service
    const newBook = {
      title: bookName,
      author: authorName,
    };

    await addBook(newBook);

    // Alert message
    alert("Book added successfully!");

    // Redirect to home page
    navigate("/");
  };

  return (
    <div
      className="container py-1"
    >
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-2"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h3
            className="mb-4 py-2 px-3 rounded text-center"
            style={{
              background:
                "linear-gradient(90deg, rgba(13,110,253,0.15), rgba(32,201,151,0.15))",
              color: "#0d6efd",
              fontWeight: 600,
            }}
          >
            Add Book
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Book Name</label>
              <input
                type="text"
                className="form-control"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
              {errors.bookName && (
                <div className="text-danger">{errors.bookName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                className="form-control"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              {errors.authorName && (
                <div className="text-danger">{errors.authorName}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookForm;
