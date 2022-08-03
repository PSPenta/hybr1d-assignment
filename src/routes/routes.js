const router = require('express').Router();

const dependencies = require('./routesDependencies');

router.use('/auth', require('./authRoutes'));

router.use(
  '/buyer',
  dependencies.middlewares.auth.jwtAuth,
  require('./buyerRoutes')
);

router.use(
  '/seller',
  dependencies.middlewares.auth.jwtAuth,
  dependencies.middlewares.auth.isSeller,
  require('./sellerRoutes')
);

module.exports = router;
