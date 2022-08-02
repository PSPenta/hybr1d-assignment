const { StatusCodes } = require('http-status-codes');

const { model } = require('../config/dbConfig');
const { response, checkIfDataExists } = require('../helpers/utils');

exports.listOfSellers = async (req, res) => {
  try {
    let sellers = await model('User').findAll({ where: { role: 'seller' } });
    if (checkIfDataExists(sellers)) {
      sellers = sellers.map((seller) => ({
        id: seller.id,
        username: seller.username,
        role: seller.role
      }));
      return res.json(response(null, true, { sellers }));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('No sellers found!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal Server Error'));
  }
};
