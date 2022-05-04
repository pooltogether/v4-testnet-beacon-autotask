const { drawBeaconHandler } = require('./drawBeaconHandler')
const DrawBeaconRinkeby = require('@pooltogether/v4-testnet/deployments/rinkeby/DrawBeacon.json')

async function handler(event) {
  await drawBeaconHandler(event, 'rinkeby', DrawBeaconRinkeby.address)
}

exports.handler = handler
