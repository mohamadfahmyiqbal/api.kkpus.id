import jwt from "jsonwebtoken";

const authAnggota = (req, res, next) => {
  let token = null;

  // Ambil token dari cookie jika ada, jika tidak dari header Authorization (tanpa Bearer)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization; // langsung ambil tanpa "Bearer"
  }

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.anggota = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export default authAnggota;
