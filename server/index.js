require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const Book = require('./models/Book');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://book-store-sable-pi.vercel.app', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Seed data route
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing books
    await Book.deleteMany({});

    // Sample book data
    const sampleBooks = [
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        category: 'Classic',
        price: 12.99,
        rating: 4.7,
        publishedDate: new Date('1813-01-28'),
        description: 'A romantic novel of manners that satirizes issues of marriage, social class, and gender roles in early 19th-century England.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Fiction',
        price: 14.95,
        rating: 4.8,
        publishedDate: new Date('1960-07-11'),
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      },
      {
        title: '1984',
        author: 'George Orwell',
        category: 'Science Fiction',
        price: 11.99,
        rating: 4.6,
        publishedDate: new Date('1949-06-08'),
        description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism, mass surveillance, and repressive regimentation.',
        coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80'
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Classic',
        price: 10.95,
        rating: 4.3,
        publishedDate: new Date('1925-04-10'),
        description: 'A tragic love story set in the Jazz Age, exploring themes of decadence, idealism, social upheaval, and excess.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      },
      {
        title: 'Moby-Dick',
        author: 'Herman Melville',
        category: 'Adventure',
        price: 13.95,
        rating: 4.2,
        publishedDate: new Date('1851-10-18'),
        description: 'The saga of Captain Ahab and his monomaniacal pursuit of the white whale Moby Dick.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        category: 'Science Fiction',
        price: 12.50,
        rating: 4.5,
        publishedDate: new Date('1932-01-01'),
        description: 'A dystopian novel set in a futuristic World State of genetically modified citizens and an intelligence-based social hierarchy.',
        coverImage: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      }
    ];

    // Insert sample books
    await Book.insertMany(sampleBooks);
    res.status(201).json({ message: 'Sample data seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ message: 'BookStore API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
