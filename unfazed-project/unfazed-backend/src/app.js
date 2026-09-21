const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const clientRoutes = require('./routes/clientRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const noteRoutes = require('./routes/noteRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// NOTE: the payment webhook route needs the raw body for signature
// verification, so it registers its own express.raw() parser inside
// paymentRoutes.js before this global json() middleware would otherwise apply.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') return next();
  express.json()(req, res, next);
});

app.use('/invoices', express.static(path.join(__dirname, '..', 'invoices')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

module.exports = app;
