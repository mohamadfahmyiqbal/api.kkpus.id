import db from "../../models/index.js";
import { sendToUser } from "./socket.js";
import { sendPushNotification } from "./pushNotificationHelper.js";
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE, SOCKET_EVENTS } from "../../constants/notificationConstants.js";

const { Notification } = db;

/**
 * Fungsi Global untuk mengirim notifikasi (Database + Real-time + Web Push)
 * Dengan proper validation, error handling, dan consistent event names.
 */
export const sendGlobalNotification = async ({ 
  memberId, 
  title, 
  content, 
  type = NOTIFICATION_TYPE.GENERAL, 
  url = "/" 
}) => {
  try {
    // Input validation
    if (!memberId || !title || !content) {
      throw new Error('memberId, title, dan content wajib diisi');
    }

    if (typeof memberId !== 'number' && typeof memberId !== 'string') {
      throw new Error('memberId harus berupa number atau string');
    }

    // 1. Simpan ke Database untuk Riwayat/Inbox
    const newNotif = await db.Notification.create({
      member_id: memberId,
      title: title,
      content: content,
      sent_datetime: new Date(),
      status: NOTIFICATION_STATUS.UNREAD, // Use constant instead of 'SENT'
    });

    // 2. Kirim secara Real-time via Socket.io (In-App)
    const socketData = {
      notification_id: newNotif.notification_id,
      title: title,
      content: content,
      type: type,
      sent_datetime: newNotif.sent_datetime,
      url: url,
      status: 1 // Frontend format (unread)
    };

    const isSentRealtime = sendToUser(memberId, SOCKET_EVENTS.NOTIFICATION_UPDATE, socketData);

    if (isSentRealtime) {
      console.log(`🚀 Notifikasi real-time terkirim ke Member ${memberId}`);
    } else {
      console.log(`⚠️ Member ${memberId} tidak online, notifikasi hanya disimpan di database`);
    }

    // 3. KIRIM VIA WEB PUSH (Notifikasi Sistem/Fisik)
    // Jalankan async tanpa menunggu agar tidak menghambat API utama
    sendPushNotification(memberId, title, content, url)
      .then(() => console.log(`📳 Web Push terkirim ke Member ${memberId}`))
      .catch(err => {
        console.error(`❌ Gagal kirim Web Push ke Member ${memberId}:`, err.message);
        // Don't throw error here, push notification failure shouldn't break the main flow
      });

    return {
      success: true,
      notification: newNotif,
      socketSent: isSentRealtime
    };
  } catch (error) {
    console.error("[NotificationHelper Error]:", error.message);
    return {
      success: false,
      error: error.message,
      notification: null
    };
  }
};

/**
 * Batch send notifications to multiple members
 */
export const sendBatchNotifications = async (notifications) => {
  const results = [];
  
  for (const notif of notifications) {
    const result = await sendGlobalNotification(notif);
    results.push(result);
  }
  
  return results;
};

/**
 * Get notification statistics for a member
 */
export const getNotificationStats = async (memberId) => {
  try {
    const stats = await db.Notification.findAll({
      where: { member_id: memberId },
      attributes: [
        'status',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('notification_id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return {};
  }
};