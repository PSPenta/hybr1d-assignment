const router = require('express').Router();

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

module.exports = router;
