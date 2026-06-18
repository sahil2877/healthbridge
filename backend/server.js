require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());                       // Angular (port 4200) ko backend (5000) call karne deta hai
app.use(express.json());               // request body ko JSON me parse karta hai
app.use('/uploads', express.static('uploads')); // uploaded documents serve karne ke liye

// Database connect
connectDB();

// Test route - check karne ke liye ki server chal raha hai
app.get('/', (req, res) => {
  res.json({ message: 'HealthBridge API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
// app.use('/api/appointments', require('./routes/appointments')); // Day 4
// app.use('/api/records', require('./routes/records'));           // Day 5
// app.use('/api/screening', require('./routes/screening'));       // Day 6

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
