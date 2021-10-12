const { Relayer } = require('defender-relay-client');
const { drawBeaconHandleDrawStartAndComplete, utils } = require('@pooltogether/v4-autotask-lib')

async function handler(event) {
  const { infuraApiKey } = event.secrets;
  const relayer = new Relayer(event);
  const provider = utils.getInfuraProvider('rinkeby', infuraApiKey)
  const config = {
    network: 'rinkeby',
    chainId: 4,
    apiKey: infuraApiKey,
    speed: 'fast',
    gasLimit: 50000
  }

  // READ DrawBeacon State
  const { msg, err, transaction, status } = await drawBeaconHandleDrawStartAndComplete(config, relayer)
  if(err) return console.log(msg);

  // IF DrawBeacon needs to pust a Draw state forward execute a transaction. 
  if(status == 1) {
    console.log('Executing:', msg)
    ts = await relayer.sendTransaction({
      data: transaction.data,
      to: transaction.to,
      speed: config.speed,
      gasLimit: config.gasLimit,
    });
    const txRes = provider.getTransaction(ts.hash)
    txRes.wait(1)
    console.log('Completed:', msg)
  }
}

exports.handler = handler
