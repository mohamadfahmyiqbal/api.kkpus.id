// 📁 middleware/ErrorHandler.js

const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${err.message}`, { stack: err.stack, timestamp: new Date().toISOString() });
  
  // SECURITY: Do NOT expose internal error details to client
  const clientMessage = statusCode >= 500 ? "Internal Server Error" : (err.message || "Request failed");
  
  res.status(statusCode).json({
    success: false,
    message: clientMessage
  });
};

export default ErrorHandler; // Wajib ada baris ini jika ingin menggunakan default import