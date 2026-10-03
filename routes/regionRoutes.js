import express from 'express';
import axios from 'axios';

const router = express.Router();

// Base URL dari penyedia data wilayah terpercaya
const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

// 1. Ambil Semua Provinsi
router.get('/provinces', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/provinces.json`);
        res.json(response.data);
    } catch (error) {
        console.error("Error Provinces:", error.message);
        res.status(500).json({ message: "Gagal mengambil data provinsi" });
    }
});

// 2. Ambil Kota/Kab berdasarkan Province ID
router.get('/regencies/:provinceId', async (req, res) => {
    try {
        const { provinceId } = req.params;
        const response = await axios.get(`${BASE_URL}/regencies/${provinceId}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kota" });
    }
});

// 3. Ambil Kecamatan berdasarkan Regency ID
router.get('/districts/:regencyId', async (req, res) => {
    try {
        const { regencyId } = req.params;
        const response = await axios.get(`${BASE_URL}/districts/${regencyId}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kecamatan" });
    }
});

// 4. Ambil Desa/Kelurahan berdasarkan District ID
router.get('/villages/:districtId', async (req, res) => {
    try {
        const { districtId } = req.params;
        const response = await axios.get(`${BASE_URL}/villages/${districtId}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data desa" });
    }
});

export default router;