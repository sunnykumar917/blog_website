const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Article = require('./models/article');
const articlerouter = require('./routes/articles');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Helmet adds security headers to your responses
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// MongoDB Connection
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_database';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.use('/articles', articlerouter);

// 404 Not Found
app.use((req, res) => {
  res.status(404).render('error', { message: 'Not Found' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
