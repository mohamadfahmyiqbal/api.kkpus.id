/**
 * Midtrans Public IP Ranges (Official Midtrans Webhook Whitelist)
 * https://docs.midtrans.com/en/after-payment/http-notification
 */
const MIDTRANS_IPS = new Set([
  "103.208.23.6",
  "103.208.23.7",
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1"
]);

const MIDTRANS_PREFIXES = [
  "103.208.23.",
  "103.58.10",
  "103.129.22",
  "103.10.12",
  "13.250.",
  "52.220.",
  "18.136."
];

const DOKU_PREFIXES = [
  "103.10.129.",
  "103.247.16.",
  "127.0.0.1",
  "::1"
];

const isIpAllowed = (ip, provider) => {
  if (!ip) return false;
  const cleanIp = ip.replace(/^::ffff:/, "");
  if (cleanIp === "127.0.0.1" || cleanIp === "::1" || cleanIp === "localhost") return true;

  if (provider === "doku") {
    return DOKU_PREFIXES.some(prefix => cleanIp.startsWith(prefix));
  }
  return MIDTRANS_IPS.has(cleanIp) || MIDTRANS_PREFIXES.some(prefix => cleanIp.startsWith(prefix));
};

/**
 * Middleware untuk validasi Whitelist IP Webhook Masuk
 */
export const verifyWebhookIp = (provider = "midtrans") => {
  return (req, res, next) => {
    // Lewatkan IP Whitelisting pada environment development jika flag aktif
    if (process.env.NODE_ENV === "development" || process.env.BYPASS_WEBHOOK_IP_WHITELIST === "true") {
      return next();
    }

    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip;

    if (!isIpAllowed(clientIp, provider)) {
      console.warn(`[Security Alert] Unauthorized Webhook IP Attempt from: ${clientIp} for provider ${provider}`);
      return res.status(403).json({
        success: false,
        message: "Forbidden: Webhook IP not recognized by security policy.",
      });
    }

    next();
  };
};
