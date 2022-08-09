const { StatusCodes } = require('http-status-codes');
const { QueryTypes: { INSERT } } = require('sequelize');

const sequelize = require('../config/dbConfig');
const { response, checkIfDataExists } = require('../helpers/utils');

const { model } = sequelize;

exports.listOfSellers = async (req, res) => {
  try {
    const sellers = await model('user').findAll({ where: { role: 'seller' }, attributes: ['id', 'username', 'role'] });
    if (checkIfDataExists(sellers)) {
      return res.json(response(null, true, { sellers }));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('No sellers found!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};

exports.sellerCatalog = async (req, res) => {
  try {
    if (!checkIfDataExists(req.params.sellerId)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('Something went wrong!'));
    }

    const seller = await model('user').findOne({ where: { id: req.params.sellerId } });
    if (!checkIfDataExists(seller)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('Invalid seller!'));
    }

    const catalog = await model('catalog').findOne({ where: { userId: req.params.sellerId } });
    if (!checkIfDataExists(catalog)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('No catalog found for this seller!'));
    }

    const products = await model('product').findAll({ where: { catalogId: catalog.id }, attributes: ['id', 'name', 'price'] });
    if (checkIfDataExists(products)) {
      return res.json(response(null, true, { products }));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('No products found!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};

exports.createOrder = async (req, res) => {
  try {
    if (!checkIfDataExists(req.params.sellerId) || !checkIfDataExists(req.body.products)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('Something went wrong!'));
    }

    const seller = await model('user').findOne({ where: { id: req.params.sellerId } });
    if (!checkIfDataExists(seller)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('Invalid seller!'));
    }

    const catalog = await model('catalog').findOne({ where: { userId: req.params.sellerId } });
    if (!checkIfDataExists(catalog)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('No catalog found for this seller!'));
    }

    const products = await model('product').findAll({ where: { id: req.body.products } });
    if (!checkIfDataExists(products)) {
      return res.status(StatusCodes.BAD_REQUEST).json(response('No products found!'));
    }

    const order = await model('order').create({ userId: req.userId });
    await products.forEach(async (product) => {
      // await order.addProduct(product);
      // await model('orderProducts').create({ order, product });

      // Using the raw query as the above functions are not working as expected.
      await sequelize.default.query('INSERT INTO order_products (product_id, order_id) VALUES (?, ?)', { replacements: [product.id, order.id], type: INSERT });
    });
    return res.status(StatusCodes.CREATED).json(response(null, true, { message: 'Order created successfully!' }));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};
