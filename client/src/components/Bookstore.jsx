import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import BookForm from './BookForm';
import '../styles/Bookstore.css';

const Bookstore = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/books');
        if (!response.data || response.data.length === 0) {
          await axios.post('/api/seed');
          const newResponse = await axios.get('/api/books');
          setBooks(newResponse.data);
        } else {
          setBooks(response.data);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        setBooks(books.filter(book => book._id !== id));
      } catch (err) {
        setError('Error deleting book');
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBook) {
        const response = await axios.put(`/api/books/${editingBook._id}`, formData);
        setBooks(books.map(book => 
          book._id === editingBook._id ? response.data : book
        ));
      } else {
        const response = await axios.post('/api/books', formData);
        setBooks([...books, response.data]);
      }
      setShowForm(false);
      setEditingBook(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="bookstore-container">
      <header className="bookstore-header">
        <div className="header-left">
          <h1>📚 BookStore</h1>
        </div>
        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="header-right">
          <button className="add-button" onClick={handleAdd}>Add New Book</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="books-grid">
        {filteredBooks && filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book._id} className="book-card">
              <img src={book.coverImage} alt={book.title} className="book-cover" />
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-category">{book.category}</p>
                <div className="book-details">
                  <span className="book-price">${book.price.toFixed(2)}</span>
                  <span className="book-rating">★ {book.rating}</span>
                </div>
                <p className="book-description">{book.description}</p>
                <div className="book-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(book._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-books">No books found</div>
        )}
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
};

export default Bookstore;
