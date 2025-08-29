// middleware/setCookie.js
export const setAuthCookie = (req, res, next) => {
  const tokenValue = "123456789abcdef"; // bisa diganti ambil dari req, misal hasil login

  res.cookie("token", tokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  next();
};
