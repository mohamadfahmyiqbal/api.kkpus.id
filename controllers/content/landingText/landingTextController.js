// src/controllers/content/landingText/getLandingText.js

// Tidak perlu import model jika menggunakan mock data statis

/**
 * @desc Mengambil data teks utama (judul & subjudul) untuk Hero Section.
 * @route GET /api/v1/content/landing-text
 * @access Public
 */
export const getLandingText = async (req, res) => {
    try {
        const mockHeroData = {
            title_line1: "Pondasi Bisnis",
            title_line2: "Syariah",
            title_line3: "Kekal & Berkah",
            subtitle: "Jadikan transaksi usaha Anda sesuai syariat Islam, demi keberkahan dunia dan akhirat. Bergabunglah dengan kami.",
        };

        res.status(200).json({
            success: true,
            data: mockHeroData
        });

    } catch (error) {
        console.error("Error in getLandingText:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data Hero Section.",
            error: error.message
        });
    }
};