// src/controllers/content/list/getPublishedArticles.js

import db from '../../../models/index.js';

const { Article } = db;
const ARTICLE_LIMIT = 4;

/**
 * @desc Mengambil daftar 4 artikel terbaru yang statusnya 'PUBLISHED'.
 * @route GET /api/v1/content/articles
 * @access Public
 */
export const getPublishedArticles = async (req, res) => {
 try {
  const articles = await Article.findAll({
   where: {
    status: 'PUBLISHED',
   },
   // Hanya ambil kolom yang tersedia di tabel sekarang
   attributes: ['title', 'content', 'image_url'],
   limit: ARTICLE_LIMIT,
   order: [['createdAt', 'DESC']],
  });

  // Format data untuk frontend (ArticleSection.jsx): { title, text, img }
  const formattedArticles = articles.map((article) => ({
   title: article.title,
   text: article.content.substring(0, 150) + '...',
   img: article.image_url,
  }));

  res.status(200).json({
   success: true,
   data: formattedArticles
  });

 } catch (error) {
  console.error("Error in getPublishedArticles:", error);
  res.status(500).json({
   success: false,
   message: "Gagal mengambil daftar artikel.",
   error: error.message
  });
 }
};

// Ekspor fungsi ini secara default jika Anda ingin menggunakannya sebagai default export
// export default getPublishedArticles;