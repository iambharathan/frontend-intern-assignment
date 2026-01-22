require('dotenv').config();
const app = require('./app');

// Start server only in non-production or non-Vercel environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
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
}
