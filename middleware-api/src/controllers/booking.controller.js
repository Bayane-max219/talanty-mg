const { springRequest } = require('../services/springApi.service');
const logger = require('../config/logger');

const create = async (req, res, next) => {
  try {
    const { serviceId, clientNote } = req.body;

    // Règle métier 1 : vérifier que le service existe et est actif
    const service = await springRequest('GET', `/api/v1/services/${serviceId}`);
    if (!service || !service.isActive) {
      return res.status(400).json({ error: 'Service indisponible' });
    }

    // Règle métier 2 : empêcher de réserver son propre service
    if (service.provider?.id === req.user.userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas réserver votre propre service' });
    }

    const booking = await springRequest('POST', '/api/v1/bookings', {
      serviceId,
      clientNote,
    }, req.user.springToken);

    logger.info(`Nouvelle réservation créée par userId=${req.user.userId} pour serviceId=${serviceId}`);

    res.status(201).json({
      ...booking,
      message: 'Réservation créée avec succès',
    });
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const data = await springRequest('GET', '/api/v1/bookings/my', null, req.user.springToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getProviderBookings = async (req, res, next) => {
  try {
    const data = await springRequest('GET', '/api/v1/bookings/provider', null, req.user.springToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const validStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const data = await springRequest(
      'PUT',
      `/api/v1/bookings/${req.params.id}/status`,
      req.body,
      req.user.springToken
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getMyBookings, getProviderBookings, updateStatus };
