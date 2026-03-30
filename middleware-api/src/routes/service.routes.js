const router = require('express').Router();
const { body } = require('express-validator');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const ctrl = require('../controllers/service.controller');

// Routes publiques
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Routes protégées
router.post('/', authenticate, requireRole('PROVIDER'), [
  body('title').notEmpty().withMessage('Titre requis'),
  body('description').notEmpty().withMessage('Description requise'),
  body('price').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('category').notEmpty().withMessage('Catégorie requise'),
  validate,
], ctrl.create);

router.put('/:id', authenticate, requireRole('PROVIDER'), ctrl.update);
router.delete('/:id', authenticate, requireRole('PROVIDER'), ctrl.remove);
router.get('/my/list', authenticate, requireRole('PROVIDER'), ctrl.getMyServices);

module.exports = router;
