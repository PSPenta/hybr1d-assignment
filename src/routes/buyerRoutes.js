const router = require('express').Router();
const { param } = require('express-validator');

const dependencies = require('./routesDependencies');

/**
 * @swagger
 * /buyer/list-of-sellers:
 *  get:
 *    tags:
 *      - Buyer
 *    name: Sellers List API
 *    summary: This api provides a list of all the sellers available.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Param Data
 *        in: param
 *        schema:
 *          type: object
 *    responses:
 *      200:
 *        description: All the blogs and videos.
 *      422:
 *        description: Input validation error messages.
 *      500:
 *        description: Internal server error.
 */
router.get(
  '/list-of-sellers',
  dependencies.controllers.buyer.listOfSellers
);

/**
 * @swagger
 * /buyer/seller-catalog/:sellerId:
 *  get:
 *    tags:
 *      - Buyer
 *    name: Seller Catalog API
 *    summary: This api provides the catalog info of specified seller.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Param Data
 *        in: param
 *        schema:
 *         type: object
 *         properties:
 *          sellerId:
 *            type: number
 *        required:
 *         - sellerId
 *    responses:
 *      200:
 *        description: All the blogs and videos.
 *      422:
 *        description: Input validation error messages.
 *      500:
 *        description: Internal server error.
 */
router.get(
  '/seller-catalog/:sellerId',
  [
    param('sellerId')
      .exists().withMessage('Seller is mandatory!')
      .isInt({ min: 0, max: 99999999999 })
      .withMessage('Invalid seller!')
  ],
  dependencies.middlewares.requestValidator.validateRequest,
  dependencies.controllers.buyer.sellerCatalog
);

module.exports = router;
