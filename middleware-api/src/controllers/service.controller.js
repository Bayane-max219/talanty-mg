const { springRequest } = require('../services/springApi.service');

const getAll = async (req, res, next) => {
  try {
    const { page = 0, size = 12, category, keyword } = req.query;
    const params = new URLSearchParams({ page, size });
    if (category) params.append('category', category);
    if (keyword) params.append('keyword', keyword);

    const data = await springRequest('GET', `/api/v1/services?${params}`);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await springRequest('GET', `/api/v1/services/${req.params.id}`);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    // Logique métier : vérifier que le provider ne dépasse pas 10 services actifs
    const myServices = await springRequest('GET', '/api/v1/services/my', null, req.user.springToken);
    if (myServices.length >= 10) {
      return res.status(400).json({ error: 'Limite de 10 services actifs atteinte' });
    }

    const data = await springRequest('POST', '/api/v1/services', req.body, req.user.springToken);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await springRequest('PUT', `/api/v1/services/${req.params.id}`, req.body, req.user.springToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await springRequest('DELETE', `/api/v1/services/${req.params.id}`, null, req.user.springToken);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const getMyServices = async (req, res, next) => {
  try {
    const data = await springRequest('GET', '/api/v1/services/my', null, req.user.springToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, getMyServices };
