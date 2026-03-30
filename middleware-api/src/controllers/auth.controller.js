const jwt = require('jsonwebtoken');
const { springRequest } = require('../services/springApi.service');
const logger = require('../config/logger');

/**
 * Enregistrement : valide les données côté middleware, puis délègue à Spring Boot.
 * Le middleware émet ensuite son propre JWT (2ème couche de sécurité).
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // Logique métier : vérifier que le rôle est valide
    const allowedRoles = ['CLIENT', 'PROVIDER'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Appel Spring Boot
    const springResponse = await springRequest('POST', '/api/v1/auth/register', {
      fullName, email, password, phone, role,
    });

    // Émettre le token middleware (2ème token)
    const middlewareToken = generateMiddlewareToken(springResponse);

    logger.info(`Nouvel utilisateur enregistré: ${email} [${role || 'CLIENT'}]`);

    res.status(201).json({
      ...springResponse,
      middlewareToken,
      message: 'Inscription réussie',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login : authentifie via Spring Boot, puis génère le token middleware.
 * L'utilisateur reçoit 2 tokens : Spring JWT + Middleware JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Authentification via Spring Boot
    const springResponse = await springRequest('POST', '/api/v1/auth/login', { email, password });

    // Émettre le token middleware
    const middlewareToken = generateMiddlewareToken(springResponse);

    logger.info(`Connexion réussie: ${email}`);

    res.json({
      ...springResponse,
      middlewareToken,
      message: 'Connexion réussie',
    });
  } catch (err) {
    next(err);
  }
};

const generateMiddlewareToken = (springData) => {
  return jwt.sign(
    {
      userId: springData.userId,
      email: springData.email,
      role: springData.role,
      springToken: springData.token, // On stocke le token Spring pour transmettre aux appels suivants
    },
    process.env.JWT_SECRET,
    { expiresIn: parseInt(process.env.JWT_EXPIRATION) || 86400 }
  );
};

module.exports = { register, login };
