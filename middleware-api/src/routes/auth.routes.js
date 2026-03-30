const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { register, login } = require('../controllers/auth.controller');

router.post('/register', [
  body('fullName').notEmpty().trim().withMessage('Nom complet requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères'),
  body('role').optional().isIn(['CLIENT', 'PROVIDER']).withMessage('Rôle invalide'),
  validate,
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  validate,
], login);

module.exports = router;
