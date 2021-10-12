const { Relayer } = require('defender-relay-client');
const { getContracts } = require('./getContracts')
const { drawBeaconHandleDrawStartAndComplete } = require('@pooltogether/v4-autotask-lib')

async function handler(event) {
  const { infuraApiKey } = event.secrets;
  const config = {
    network: 'rinkeby',
    chainId: 4,
    apiKey: infuraApiKey,
    speed: 'fast',
    gasLimit: 50000
  }
  const { msg, err, data } = await drawBeaconHandleDrawStartAndComplete(config, new Relayer(event))
  console.log(msg)
}

exports.handler = handler
