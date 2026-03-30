const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification - Couche 2 (Middleware API)
 * Vérifie le token JWT émis par le middleware lui-même.
 * C'est la 2ème couche de sécurité (la 1ère étant Spring Security côté backend).
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou format invalide' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès refusé — rôle insuffisant' });
  }
  next();
};

module.exports = { authenticate, requireRole };
