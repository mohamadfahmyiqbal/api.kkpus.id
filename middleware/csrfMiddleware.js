import crypto from 'crypto';

/**
 * Double Submit Cookie CSRF Protection Middleware
 * Generates and validates CSRF tokens via cookies & custom headers.
 */
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'x-xsrf-token';

export const generateCsrfToken = (req, res, next) => {
  let token = req.cookies ? req.cookies[CSRF_COOKIE_NAME] : null;
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    const isSecure = process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Frontend JS reads this to send in custom header
      secure: isSecure,
      sameSite: 'Lax',
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });
  }
  res.locals.csrfToken = token;
  next();
};

export const verifyCsrfToken = (req, res, next) => {
  // Safe methods skip verification
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies ? req.cookies[CSRF_COOKIE_NAME] : null;
  const headerToken = req.headers[CSRF_HEADER_NAME] || req.headers[CSRF_HEADER_NAME.toLowerCase()] || req.body?._csrf;

  // If no cookie was provided or token mismatch
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token missing or invalid. Permintaan ditolak.',
    });
  }

  next();
};
