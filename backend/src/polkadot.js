const { ApiPromise, WsProvider } = require('@polkadot/api');
require('dotenv').config();

const connectPolkadot = async () => {
  try {
    const wsUrl = process.env.POLKADOT_WS_URL || 'wss://rpc.polkadot.io';
    console.log(`Connecting to Polkadot WS at ${wsUrl}`);

    const wsProvider = new WsProvider(wsUrl);
    const api = await ApiPromise.create({ provider: wsProvider });

    await api.isReady;
    console.log('Connected to Polkadot.');

    return api;
  } catch (error) {
    console.error('Failed to connect to Polkadot:', error);
    process.exit(1); // Exit the process if unable to connect
  }
};

module.exports = connectPolkadot;
