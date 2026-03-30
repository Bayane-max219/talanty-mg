const { springRequest } = require('../services/springApi.service');

/**
 * Agrégation de données depuis plusieurs endpoints Spring Boot.
 * C'est une des valeurs ajoutées du middleware : combiner des données.
 */
const getDashboard = async (req, res, next) => {
  try {
    const token = req.user.springToken;

    // Appels parallèles pour optimiser les performances
    const [bookingStats, myBookings, providerBookings] = await Promise.allSettled([
      springRequest('GET', '/api/v1/bookings/stats', null, token),
      springRequest('GET', '/api/v1/bookings/my', null, token),
      req.user.role === 'PROVIDER'
        ? springRequest('GET', '/api/v1/bookings/provider', null, token)
        : Promise.resolve([]),
    ]);

    const stats = bookingStats.status === 'fulfilled' ? bookingStats.value : {};
    const clientBookings = myBookings.status === 'fulfilled' ? myBookings.value : [];
    const receivedBookings = providerBookings.status === 'fulfilled' ? providerBookings.value : [];

    res.json({
      user: {
        id: req.user.userId,
        email: req.user.email,
        role: req.user.role,
      },
      stats: {
        ...stats,
        totalClientBookings: Array.isArray(clientBookings) ? clientBookings.length : 0,
        totalReceivedBookings: Array.isArray(receivedBookings) ? receivedBookings.length : 0,
      },
      recentClientBookings: Array.isArray(clientBookings) ? clientBookings.slice(0, 5) : [],
      recentReceivedBookings: Array.isArray(receivedBookings) ? receivedBookings.slice(0, 5) : [],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
