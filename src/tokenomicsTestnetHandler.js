const { drawBeaconHandler } = require('./drawBeaconHandler')

async function handler(event) {
  await drawBeaconHandler(event, 'polygon-mumbai', '0x9DFe0F74A7685B94ADF5043e37E220D4872F8d81')
}

exports.handler = handler
