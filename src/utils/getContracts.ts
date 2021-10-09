const ethers = require('ethers')
const DrawBeaconRinkeby = require('@pooltogether/v4-testnet/deployments/rinkeby/DrawBeacon.json')

function getContracts(infuraApiKey: string) {
  const ethereumProvider = new ethers.providers.InfuraProvider('rinkeby', infuraApiKey)
  const drawBeacon = new ethers.Contract(DrawBeaconRinkeby.address, DrawBeaconRinkeby.abi, ethereumProvider)
  return {
    ethereumProvider,
    drawBeacon,
  }
}

module.exports = {
  getContracts
}