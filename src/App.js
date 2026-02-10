import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/HomePage";
import BookForm from "./components/BookForm";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="container my-4 pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-book" element={<BookForm />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
