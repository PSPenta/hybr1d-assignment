const { StatusCodes } = require('http-status-codes');

const { model } = require('../config/dbConfig');
const { response, checkIfDataExists } = require('../helpers/utils');

exports.createCatalog = async (req, res) => {
  try {
    const userData = await model('User').findOne({ where: { id: req.userId } });
    if (checkIfDataExists(userData)) {
      let catalog = await model('Catalog').findOne({ where: { userId: req.userId } });
      if (!checkIfDataExists(catalog)) {
        catalog = await model('Catalog').create({ userId: req.userId });
      }
      await req.body.products.forEach(async (product) => {
        await model('Product').create({
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
