require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());                       // Allows Angular (port 4200) to call the backend (5000)
app.use(express.json());               // Parses the request body as JSON
app.use('/uploads', express.static('uploads')); // Serves uploaded documents
app.use(require('./middleware/auditLogger')); // Records authenticated write actions

// Connect to the database
connectDB();

// Test route - confirms the server is running
app.get('/', (req, res) => {
  res.json({ message: 'HealthBridge API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/records', require('./routes/records'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/lab', require('./routes/lab'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/screening', require('./routes/screening'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
