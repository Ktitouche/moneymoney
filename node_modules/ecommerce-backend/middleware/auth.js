const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  try {
    const headerToken = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.cookies?.auth_token || headerToken;

    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (verifyError, decoded) => {
      if (verifyError) {
        return res.status(401).json({ message: 'Token invalide.' });
      }

      try {
        const user = await User.findById(decoded.id).select('role tokenVersion');

        if (!user) {
          return res.status(401).json({ message: 'Token invalide.' });
        }

        if (decoded.tokenVersion !== user.tokenVersion) {
          return res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.' });
        }

        req.user = {
          id: user._id.toString(),
          role: user.role,
          tokenVersion: user.tokenVersion
        };
        next();
      } catch (dbError) {
        return res.status(401).json({ message: 'Token invalide.' });
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
  next();
};

module.exports = { auth, isAdmin };
