const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csrfProtection = require('./middleware/csrf');

dotenv.config();

const app = express();

app.set('trust proxy', 1);

const startupErrors = [];

if (!process.env.MONGODB_URI) {
  startupErrors.push('MONGODB_URI is required');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  startupErrors.push('JWT_SECRET must be set and at least 32 characters long');
}

if (startupErrors.length > 0) {
  console.error('Backend startup aborted:');
  startupErrors.forEach((error) => console.error(`- ${error}`));
  console.error('Create backend/.env from backend/.env.example before starting the server.');
  process.exit(1);
}

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin denied'));
  },
  credentials: true
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsOptions));
app.use(globalLimiter);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(csrfProtection);
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/settings', require('./routes/settings'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API E-Commerce' });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Connecté à MongoDB'))
  .catch((err) => console.error('✗ Erreur de connexion MongoDB:', err));

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✓ Serveur démarré sur ${HOST}:${PORT}`);
});
