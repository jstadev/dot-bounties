require('dotenv').config();

module.exports = {
  polkadotWsEndpoint: process.env.POLKADOT_WS_ENDPOINT || 'wss://default.endpoint/ws',
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER || 'your_username',
    password: process.env.POSTGRES_PASSWORD || 'your_password',
    database: process.env.POSTGRES_DB || 'polkadot_bounties',
  },
  // Add other configurations as needed
};
