const router = require('express').Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const ctrl = require('../controllers/booking.controller');

router.use(authenticate);

router.post('/', [
  body('serviceId').isInt({ min: 1 }).withMessage('Service ID invalide'),
  validate,
], ctrl.create);

router.get('/my', ctrl.getMyBookings);
router.get('/provider', ctrl.getProviderBookings);
router.put('/:id/status', [
  body('status').isIn(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Statut invalide'),
  validate,
], ctrl.updateStatus);

module.exports = router;
