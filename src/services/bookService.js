import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const LOCAL_API_URL = "http://localhost:5001";

export const getBooks = async () => {
  const [apiRes, localRes] = await Promise.all([
    axios.get(`${API_URL}?_limit=5`),
    axios.get(`${LOCAL_API_URL}/local-books`),
  ]);

  // API books first, then locally created books from JSON file
  return { data: [...apiRes.data, ...localRes.data] };
};

export const getBookById = async (id) => {
  try {
    return await axios.get(`${LOCAL_API_URL}/local-books/${id}`);
  } catch (e) {
    if (e?.response?.status === 404) {
      return axios.get(`${API_URL}/${id}`);
    }
    throw e;
  }
};

export const addBook = async (book) => {
  // Persist new books into local JSON file via local server
  return axios.post(`${LOCAL_API_URL}/local-books`, book);
};

export const updateBook = async (id, book) => {
  try {
    return await axios.put(`${LOCAL_API_URL}/local-books/${id}`, book);
  } catch (e) {
    if (e?.response?.status === 404) {
      return axios.put(`${API_URL}/${id}`, book);
    }
    throw e;
  }
};

export const deleteBook = async (id) => {
  try {
    return await axios.delete(`${LOCAL_API_URL}/local-books/${id}`);
  } catch (e) {
    if (e?.response?.status === 404) {
      return axios.delete(`${API_URL}/${id}`);
    }
    throw e;
  }
};