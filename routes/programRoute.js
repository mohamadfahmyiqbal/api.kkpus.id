// routes/programRoute.js

import express from "express";
import getProgramPinjaman from "../controllers/program/getProgramPinjaman.js";
import getProgramArisan from "../controllers/program/getProgramArisan.js";
import getProgramOptions from "../controllers/program/getProgramOptions.js";
import getAvailableArisan from "../controllers/program/getAvailableArisan.js";
import getArisanDetail from "../controllers/program/getArisanDetail.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import getLoanProducts from "../controllers/loan/getLoanProducts.js";

const router = express.Router();

// GET /api/program/pinjaman - Protected
router.get("/pinjaman", MidAnggota, getProgramPinjaman);

// GET /api/program/pinjaman/produk - Fallback for loan products
router.get("/pinjaman/produk", getLoanProducts);

// GET /api/program/arisan/available - Get list of available arisan for joining
router.get("/arisan/available", MidAnggota, getAvailableArisan);

// GET /api/program/arisan/detail/:id - Get arisan detail by ID
router.get("/arisan/detail/:id", MidAnggota, getArisanDetail);

// GET /api/program/arisan - Protected
router.get("/arisan", MidAnggota, getProgramArisan);

// GET /api/program/options - Public or Protected?
router.get("/options", getProgramOptions);

export default router;
