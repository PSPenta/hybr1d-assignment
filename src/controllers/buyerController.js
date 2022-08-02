const { StatusCodes } = require('http-status-codes');

const { model } = require('../config/dbConfig');
const { response, checkIfDataExists } = require('../helpers/utils');

exports.listOfSellers = async (req, res) => {
  try {
    const sellers = await model('User').findAll({ where: { role: 'seller' }, attributes: ['id', 'username', 'role'] });
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
    if (checkIfDataExists(req.params.sellerId)) {
      const seller = await model('User').findOne({ where: { id: req.params.sellerId } });
      if (checkIfDataExists(seller)) {
        const catalog = await model('Catalog').findOne({ where: { userId: req.params.sellerId } });
        if (checkIfDataExists(catalog)) {
          const products = await model('Product').findAll({ where: { catalogId: catalog.id }, attributes: ['id', 'name', 'price'] });
          if (checkIfDataExists(products)) {
            return res.json(response(null, true, { products }));
          }
          return res.status(StatusCodes.BAD_REQUEST).json(response('No products found!'));
        }
        return res.status(StatusCodes.BAD_REQUEST).json(response('No catalog found for this seller!'));
      }
      return res.status(StatusCodes.BAD_REQUEST).json(response('Invalid seller!'));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('Something went wrong!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};
