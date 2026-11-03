// 📁 middleware/ErrorHandler.js

const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${err.message}`, { stack: err.stack, timestamp: new Date().toISOString() });
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default ErrorHandler; // Wajib ada baris ini jika ingin menggunakan default import