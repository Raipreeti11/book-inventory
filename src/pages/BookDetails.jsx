import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getBookById } from "../services/bookService";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("page") || "1";

  useEffect(() => {
    getBookById(id).then(res => setBook(res.data));
  }, [id]);

  if (!book)
    return (
      <div className="container py-4 d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="py-4" >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
                <div>
                  <h2
                    className="h3 fw-bold mb-1 text-primary"
                    style={{ wordBreak: "break-word" }}
                  >
                    {book.title}
                  </h2>
                  <p className="text-muted small mb-0">Book Details</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm align-self-start"
                  onClick={() => navigate(`/?page=${fromPage}`)}
                >
                  ← Back
                </button>
              </div>

              <div className="mb-4">
                <span className="text-muted text-uppercase small">Author</span>
                <h5 className="mt-1">
                  {book.author || (book.userId != null ? `User ${book.userId}` : "Unknown")}
                </h5>
              </div>

              <div>
                <span className="text-muted text-uppercase small">
                  Description
                </span>
                <p
                  className="mt-2 mb-0"
                  style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
                >
                  {book.body || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
