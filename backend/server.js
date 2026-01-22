require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Start server (works for both development and Render)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Server is running!                ║
║   📍 Port: ${PORT}                       ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
║   📡 API: http://localhost:${PORT}/api   ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
