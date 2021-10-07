const ethers = require('ethers')
const { Relayer } = require('defender-relay-client');
const { getContracts } = require('./getContracts')



async function handler(event) {
  const rinkebyRelayer = new Relayer(event);
  const {
    mumbaiRelayerApiKey,
    mumbaiRelayerSecret,
    infuraApiKey
  } = event.secrets;
  
  const {
    drawBeacon,
  } = getContracts(infuraApiKey)

  const nextDrawId = await drawBeacon.nextDrawId()
  const getLastRngRequestId = await drawBeacon.getLastRngRequestId()
  const beaconPeriodStartedAt = await drawBeacon.getBeaconPeriodStartedAt()
  const isBeaconPeriodOver = await drawBeacon.isRngRequested()
  const beaconPeriodSeconds = await drawBeacon.getBeaconPeriodSeconds()

  console.log('DrawBeacon Beacon PeriodStartedAt:', beaconPeriodStartedAt.toString())
  console.log('DrawBeacon Beacon PeriodSeconds:', beaconPeriodSeconds.toString())
  console.log('DrawBeacon Beacon PeriodOver:', isBeaconPeriodOver)
  
  console.log('DrawBeacon next Draw.drawId:', nextDrawId)
  console.log('DrawBeacon RNG ID:', getLastRngRequestId)

  console.log('Is RNG Requested:', await drawBeacon.isRngRequested())
  console.log('Can Start Draw:', await drawBeacon.canStartDraw())
  console.log('Can Complete Draw:', await drawBeacon.canCompleteDraw())

  if (await drawBeacon.canStartDraw()) {
    console.log(`Starting draw ${nextDrawId}...`)
    const tx = await drawBeacon.populateTransaction.startDraw()
    const txRes = await rinkebyRelayer.sendTransaction({
      data: tx.data,
      to: tx.to,
      speed: 'fast',
      gasLimit: 500000,
    });
    console.log(`Started Draw ${nextDrawId}: ${txRes.hash}`)
  }

  let completedDraw = false
  if (await drawBeacon.canCompleteDraw()) {
    console.log(`Completing draw ${nextDrawId}...`)
    const tx = await drawBeacon.populateTransaction.completeDraw()
    const txRes = await rinkebyRelayer.sendTransaction({
      data: tx.data,
      to: tx.to,
      speed: 'fast',
      gasLimit: 500000,
    });
    console.log(`Completed Draw ${nextDrawId}: ${txRes.hash}`)
    completedDraw = true
  }
  console.log("Handler Complete!")
}

exports.handler = handler
