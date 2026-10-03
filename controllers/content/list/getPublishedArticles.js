// src/controllers/content/list/getPublishedArticles.js

import db from "../../../models/index.js";

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
        status: "PUBLISHED",
      },
      attributes: ["title", "content", "image_url"],
      limit: ARTICLE_LIMIT,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // Format data untuk frontend (ArticleSection.jsx): { title, text, img }
    const formattedArticles = articles.map((article) => ({
      title: article.title,
      text: article.content ? `${article.content.substring(0, 150)}...` : "",
      img: article.image_url,
    }));

    return res.status(200).json({
      success: true,
      data: formattedArticles,
    });
  } catch (error) {
    console.error("Error in getPublishedArticles:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar artikel.",
      error: error.message,
    });
  }
};