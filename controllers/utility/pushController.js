import db from "../../models/index.js";
import { sendPushNotification } from "./pushNotificationHelper.js";
const { PushSubscription } = db;

/**
 * Controller untuk mendapatkan VAPID Public Key
 * Digunakan oleh frontend untuk subscribe ke push notifications
 */
export const getVapidPublicKey = async (req, res) => {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    
    if (!vapidPublicKey) {
      console.warn("⚠️ [VAPID-KEY] VAPID_PUBLIC_KEY tidak ditemukan di environment variables");
      return res.status(500).json({ 
        success: false, 
        message: "VAPID public key tidak tersedia." 
      });
    }

    console.log("🔑 [VAPID-KEY] Public key dikirim ke frontend");
    res.status(200).json({ 
      success: true, 
      vapid_public_key: vapidPublicKey 
    });
  } catch (error) {
    console.error("❌ [VAPID-KEY] Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Controller untuk mendaftarkan device ke database
 * Digunakan oleh route: router.post("/subscribe", subscribeToPush)
 */
export const subscribeToPush = async (req, res) => {
  try {
    // DEBUG: Melihat data mentah yang dikirim oleh frontend
    console.log("📥 [PUSH-SUBSCRIBE] Request Received:", JSON.stringify(req.body, null, 2));

    const { subscription, member_id, device_type, registration_id } = req.body;

    // Validasi Data
    if (!subscription || (!member_id && !registration_id) || !subscription.keys) {
      console.warn("⚠️ [PUSH-SUBSCRIBE] Data tidak lengkap:", { 
        hasSubscription: !!subscription, 
        member_id, 
        registration_id 
      });
      return res.status(400).json({ 
        success: false,
        message: "Data subscription atau ID identitas tidak lengkap." 
      });
    }

    const { endpoint, keys } = subscription;
    const targetId = member_id || registration_id;

    /**
     * Menggunakan upsert agar satu endpoint (browser) unik tidak terdaftar ganda
     */
    const [instance, created] = await PushSubscription.upsert({
      member_id: targetId,
      endpoint: endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      device_type: device_type || "Web Browser",
      updatedAt: new Date()
    });

    console.log(`🚀 [PUSH-SUBSCRIBE] SUCCESS: Target ID ${targetId} | Is New Record: ${created}`);

    res.status(201).json({ 
      success: true, 
      message: "Push subscription berhasil disimpan.",
      debug: { created }
    });
  } catch (error) {
    console.error("❌ [PUSH-SUBSCRIBE] Fatal Error:", error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Controller untuk pengecekan manual (Test Push)
 */
export const testPushNotification = async (req, res) => {
  try {
    console.log("🧪 [TEST-PUSH] Attempting to send manual push...");
    const { member_id, title, message, url } = req.body;

    if (!member_id) {
      console.warn("⚠️ [TEST-PUSH] Failed: No member_id provided in body");
      return res.status(400).json({ 
        success: false, 
        message: "member_id wajib diisi untuk testing." 
      });
    }

    // Memanggil helper internal
    console.log(`📡 [TEST-PUSH] Calling helper for member_id: ${member_id}`);
    await sendPushNotification(
      member_id,
      title || "Test Notifikasi",
      message || "Sistem notifikasi Koperasi PUS aktif!",
      url || "/"
    );

    console.log(`✅ [TEST-PUSH] Response 200 sent for member_id: ${member_id}`);
    res.status(200).json({ 
      success: true, 
      message: `Permintaan push dikirim ke ID: ${member_id}. Periksa perangkat Anda.` 
    });
  } catch (error) {
    console.error("❌ [TEST-PUSH] Fatal Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};