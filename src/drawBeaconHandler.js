const { Relayer } = require('defender-relay-client');
const DrawBeaconArtifact = require('@pooltogether/v4-testnet/artifacts/@pooltogether/v4-core/contracts/DrawBeacon.sol/DrawBeacon.json')
const ethers = require('ethers')

async function drawBeaconHandler(event, networkName, drawBeaconAddress) {
  const relayer = new Relayer(event);
  const {
    infuraApiKey
  } = event.secrets;

  const rpcUrl = `https://${networkName}.infura.io/v3/${infuraApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const drawBeacon = new ethers.Contract(drawBeaconAddress, DrawBeaconArtifact.abi, provider)

  const nextDrawId = await drawBeacon.getNextDrawId()
  const beaconPeriodStartedAt = await drawBeacon.getBeaconPeriodStartedAt()
  const isBeaconPeriodOver = await drawBeacon.isRngRequested()
  const beaconPeriodSeconds = await drawBeacon.getBeaconPeriodSeconds()

  console.log('DrawBeacon Beacon PeriodStartedAt:', beaconPeriodStartedAt.toString())
  console.log('DrawBeacon Beacon PeriodSeconds:', beaconPeriodSeconds.toString())
  console.log('DrawBeacon Beacon PeriodOver:', isBeaconPeriodOver)
  
  console.log('DrawBeacon next Draw.drawId:', nextDrawId)

  console.log('Is RNG Requested:', await drawBeacon.isRngRequested())
  console.log('Can Start Draw:', await drawBeacon.canStartDraw())
  console.log('Can Complete Draw:', await drawBeacon.canCompleteDraw())

  if (await drawBeacon.canStartDraw()) {
    console.log(`Starting draw ${nextDrawId}...`)
    const tx = await drawBeacon.populateTransaction.startDraw()
    const txRes = await relayer.sendTransaction({
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
    const txRes = await relayer.sendTransaction({
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

exports.drawBeaconHandler = drawBeaconHandler
