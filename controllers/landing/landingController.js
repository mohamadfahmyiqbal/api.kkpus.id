/**
 * Landing Page Controller
 * Menangani semua endpoint untuk Landing Page
 */

import db from "../../models/index.js";

// GET /api/landing/services
export const getServices = async (req, res) => {
  try {
    const services = await db.LandingService.findAll({
      where: { is_active: true },
      order: [["order_index", "ASC"]],
      attributes: [
        "service_id",
        "title",
        "description",
        "icon",
        "color",
        "order_index",
      ],
    });

    res.status(200).json({
      success: true,
      data: services.map((service) => ({
        id: service.service_id,
        title: service.title,
        description: service.description,
        icon: service.icon,
        color: service.color,
        order: service.order_index,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data layanan",
      error: error.message,
    });
  }
};

// GET /api/landing/stats
export const getStats = async (req, res) => {
  try {
    const stats = await db.LandingStats.findOne({
      attributes: [
        "active_members",
        "financed_businesses",
        "satisfaction_rate",
        "cities",
      ],
    });

    res.status(200).json({
      success: true,
      data: stats || {
        active_members: 0,
        financed_businesses: 0,
        satisfaction_rate: 0,
        cities: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data statistik",
      error: error.message,
    });
  }
};

// GET /api/landing/about
export const getAbout = async (req, res) => {
  try {
    const about = await db.LandingAbout.findOne({
      attributes: ["title", "description", "vision", "mission"],
    });

    res.status(200).json({
      success: true,
      data: about || {
        title: "",
        description: "",
        vision: "",
        mission: "",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data tentang kami",
      error: error.message,
    });
  }
};

// GET /api/landing/contact
export const getContact = async (req, res) => {
  try {
    const contact = await db.LandingContact.findOne({
      attributes: [
        "phone",
        "email",
        "address",
        "facebook_url",
        "instagram_url",
        "linkedin_url",
      ],
    });

    const formattedContact = contact
      ? {
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
          social_media: {
            facebook: contact.facebook_url,
            instagram: contact.instagram_url,
            linkedin: contact.linkedin_url,
          },
        }
      : {
          phone: "",
          email: "",
          address: "",
          social_media: {
            facebook: "",
            instagram: "",
            linkedin: "",
          },
        };

    res.status(200).json({
      success: true,
      data: formattedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kontak",
      error: error.message,
    });
  }
};

// POST /api/landing/contact-form
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan pesan harus diisi",
      });
    }

    // Save to database
    const contactForm = await db.ContactForm.create({
      name: name,
      email: email,
      phone: phone || null,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: "Pesan berhasil dikirim",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengirim pesan",
      error: error.message,
    });
  }
};

// GET /api/landing/content (Combined endpoint)
export const getAllContent = async (req, res) => {
  try {
    // Get all data from database
    const [services, stats, about, contact] = await Promise.all([
      db.LandingService.findAll({
        where: { is_active: true },
        order: [["order_index", "ASC"]],
        attributes: [
          "service_id",
          "title",
          "description",
          "icon",
          "color",
          "order_index",
        ],
      }),
      db.LandingStats.findOne({
        attributes: [
          "active_members",
          "financed_businesses",
          "satisfaction_rate",
          "cities",
        ],
      }),
      db.LandingAbout.findOne({
        attributes: ["title", "description", "vision", "mission"],
      }),
      db.LandingContact.findOne({
        attributes: [
          "phone",
          "email",
          "address",
          "facebook_url",
          "instagram_url",
          "linkedin_url",
        ],
      }),
    ]);

    // Format services
    const formattedServices = services.map((service) => ({
      id: service.service_id,
      title: service.title,
      description: service.description,
      icon: service.icon,
      color: service.color,
      order: service.order_index,
    }));

    // Format contact
    const formattedContact = contact
      ? {
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
          social_media: {
            facebook: contact.facebook_url,
            instagram: contact.instagram_url,
            linkedin: contact.linkedin_url,
          },
        }
      : {
          phone: "",
          email: "",
          address: "",
          social_media: {
            facebook: "",
            instagram: "",
            linkedin: "",
          },
        };

    res.status(200).json({
      success: true,
      data: {
        services: formattedServices,
        stats: stats || {
          active_members: 0,
          financed_businesses: 0,
          satisfaction_rate: 0,
          cities: 0,
        },
        about: about || {
          title: "",
          description: "",
          vision: "",
          mission: "",
        },
        contact: formattedContact,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data landing page",
      error: error.message,
    });
  }
};
