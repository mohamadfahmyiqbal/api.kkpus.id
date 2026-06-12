// src/models/content/articles.js (REVISI)

import { Sequelize } from "sequelize";

const Article = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ArticleModel = sequelize.define("articles", {
    article_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    // Kolom 'member_id' DIHAPUS, karena tidak ada di skema DB (image_ddac01.png).
    // Kolom 'published_at' DIHAPUS, karena tidak ada di skema DB.
    
    title: {
      type: DataTypes.STRING(255),
      allowNull: true, // Diubah menjadi TRUE sesuai 'NULL: YES' di DB
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true, // Diubah menjadi TRUE sesuai 'NULL: YES' di DB
    },
    image_url: { // KOLOM BARU ditambahkan sesuai skema DB
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    status: {
      type: DataTypes.STRING(50), // Diubah dari ENUM ke STRING(50) dan 
      allowNull: true, // Diubah menjadi TRUE sesuai 'NULL: YES' di DB
      defaultValue: 'DRAFT',
    },
    // 'createdAt' dan 'updatedAt' ditangani oleh timestamps: true
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return ArticleModel;
};

export default Article;