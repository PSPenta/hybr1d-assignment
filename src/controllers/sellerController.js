const { StatusCodes } = require('http-status-codes');

const { model } = require('../config/dbConfig');
const { response, checkIfDataExists } = require('../helpers/utils');

exports.createCatalog = async (req, res) => {
  try {
    if (req.userId) {
      let catalog = await model('catalog').findOne({ where: { userId: req.userId } });
      if (!checkIfDataExists(catalog)) {
        catalog = await model('catalog').create({ userId: req.userId });
      }
      await req.body.products.forEach(async (product) => {
        await model('product').create({
          name: product.name,
          price: product.price,
          catalogId: catalog.id
        });
      });

      if (catalog) {
        return res.status(StatusCodes.CREATED).json(response(null, true, { message: 'Products added to seller catalog successfully!' }));
      }
      return res.status(StatusCodes.BAD_REQUEST).json(response('Unable to add products in the catalog!'));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('Invalid request!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};

exports.allOrders = async (req, res) => {
  try {
    if (req.userId) {
      const catalog = await model('catalog').findOne({ where: { userId: req.userId } });
      if (checkIfDataExists(catalog)) {
        const products = await model('product').findAll({ where: { catalogId: catalog.id } });
        if (checkIfDataExists(products)) {
          const productIds = products.map((product) => product.id);

          const orders = await model('orderProducts').findAll({ where: { product_id: productIds } });
          if (checkIfDataExists(orders)) {
            return res.json(response(null, true, { orders }));
          }
          return res.status(StatusCodes.BAD_REQUEST).json(response('No orders found for your catalog!'));
        }
        return res.status(StatusCodes.BAD_REQUEST).json(response('No products found in the catalog!'));
      }
      return res.status(StatusCodes.BAD_REQUEST).json(response('No catalogs for you!'));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('Invalid user!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};
