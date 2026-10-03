import webpush from "web-push";
import db from "../models/index.js";

const { PushSubscription } = db;

// ── VAPID Configuration (single source of truth) ──────────────────────────
const VAPID_SUBJECT = process.env.VAPID_EMAIL || "mailto:admin@kkpus.id";
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;

let vapidConfigured = false;

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
    vapidConfigured = true;
    console.log("✅ Web-Push VAPID configured.");
  } catch (error) {
    console.error("❌ Web-Push VAPID config error:", error.message);
  }
} else {
  console.warn("⚠️ VAPID keys missing. Push notifications are disabled.");
}

/**
 * Send push notification to a member's subscribed devices.
 *
 * @param {number|string} memberId - Target member ID
 * @param {string|object}  title   - Notification title, or an object payload
 * @param {string}         [message] - Notification body (if title is a string)
 * @param {string}         [url='/'] - URL to open on notification click
 * @returns {{ success: boolean, total?: number, success?: number, expired?: number, failed?: number, error?: string }}
 */
export const sendPushNotification = async (memberId, title, message, url = "/") => {
  console.log(`[PUSH] Starting push for Member: ${memberId}`);

  if (!vapidConfigured) {
    console.warn("[PUSH] Skipped — VAPID not configured.");
    return { success: false, count: 0, reason: "VAPID not configured" };
  }

  // Support both positional args and object payload
  const payloadData =
    typeof title === "object" && title !== null
      ? title
      : { title, content: message, url };

  try {
    const subscriptions = await PushSubscription.findAll({
      where: { member_id: memberId },
    });

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`[PUSH] No subscriptions found for Member: ${memberId}`);
      return { success: false, count: 0, reason: "No subscriptions" };
    }

    const payload = JSON.stringify({
      title: payloadData.title || "Koperasi PUS",
      content:
        payloadData.content || payloadData.body || payloadData.message || "",
      body:
        payloadData.content || payloadData.body || payloadData.message || "",
      url: payloadData.url || "/",
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        };

        try {
          await webpush.sendNotification(pushConfig, payload);
          console.log(`[PUSH] Sent to ${sub.endpoint.substring(0, 40)}...`);
          return { status: "success", endpoint: sub.endpoint };
        } catch (err) {
          // Remove expired / invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(
              `[PUSH] Removing expired subscription for Member ${memberId}`,
            );
            await sub.destroy();
            return { status: "expired", endpoint: sub.endpoint };
          }
          console.error(
            `[PUSH] Error [${err.statusCode}] for Member ${memberId}:`,
            err.message,
          );
          throw err;
        }
      }),
    );

    const summary = {
      total: results.length,
      success: results.filter(
        (r) => r.status === "fulfilled" && r.value?.status === "success",
      ).length,
      expired: results.filter(
        (r) => r.status === "fulfilled" && r.value?.status === "expired",
      ).length,
      failed: results.filter((r) => r.status === "rejected").length,
    };

    console.log(`[PUSH] Summary for Member ${memberId}:`, summary);
    return { success: true, ...summary };
  } catch (error) {
    console.error("[PUSH] sendPushNotification error:", error.message);
    return { success: false, error: error.message };
  }
};