const router = require('express').Router();

const dependencies = require('./routesDependencies');

router.use('/auth', require('./authRoutes'));

router.use(
  '/seller',
  dependencies.middlewares.auth.jwtAuth,
  dependencies.middlewares.auth.isSeller,
  require('./sellerRoutes')
);

module.exports = router;
