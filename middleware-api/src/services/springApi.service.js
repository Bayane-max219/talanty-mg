const axios = require('axios');
const logger = require('../config/logger');

const springClient = axios.create({
  baseURL: process.env.SPRING_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour logger les erreurs Spring Boot
springClient.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    logger.error(`Spring API Error [${status}]: ${message}`);

    const err = new Error(message || 'Erreur de communication avec le serveur de données');
    err.status = status || 503;
    return Promise.reject(err);
  }
);

/**
 * Appelle l'API Spring Boot avec le token JWT de l'utilisateur.
 * Double sécurité : le middleware vérifie son propre token, puis transmet
 * le token Spring Boot original pour que Spring Security le re-valide.
 */
const springRequest = async (method, url, data = null, springToken = null) => {
  const config = {
    method,
    url,
    ...(data && { data }),
    ...(springToken && { headers: { Authorization: `Bearer ${springToken}` } }),
  };
  const response = await springClient(config);
  return response.data;
};

module.exports = { springRequest, springClient };
