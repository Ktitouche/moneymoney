const crypto = require('crypto');
const CSRF_HEADER_NAME = 'x-csrf-token';

const isStateChangingMethod = (method = '') => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

const csrfProtection = (req, res, next) => {
    if (!isStateChangingMethod(req.method)) {
        return next();
    }

    // Enforce CSRF only for cookie-authenticated browser sessions.
    if (!req.cookies?.auth_token) {
        return next();
    }

    const csrfCookie = req.cookies?.csrf_token;
    const csrfHeader = req.header(CSRF_HEADER_NAME);

    if (!csrfCookie || !csrfHeader) {
        return res.status(403).json({ message: 'Jeton CSRF invalide.' });
    }

    try {
        const cookieBuf = Buffer.from(csrfCookie);
        const headerBuf = Buffer.from(csrfHeader);
        if (cookieBuf.length !== headerBuf.length || !crypto.timingSafeEqual(cookieBuf, headerBuf)) {
            return res.status(403).json({ message: 'Jeton CSRF invalide.' });
        }
    } catch {
        return res.status(403).json({ message: 'Jeton CSRF invalide.' });
    }

    return next();
};

module.exports = csrfProtection;
