const logout = async (req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Invalidate the JWT token (add to blacklist)
    // 2. Clear session data
    // 3. Remove refresh tokens
    
    // For now, we'll just return success
    // The frontend should handle clearing local storage/tokens
    
    return res.status(200).json({
      status: true,
      message: "Logout berhasil"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { logout };
