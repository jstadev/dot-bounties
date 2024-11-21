require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const db = require('../models');
const bountyRoutes = require('./routes/bounties');
const connectPolkadot = require('./polkadot');
const fetchHistoricalData = require('./fetchHistoricalData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(express.json());

// Routes
app.use('/api/bounties', bountyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Polkadot Bounties API');
});

// Start the server and initialize connections
const startServer = async () => {
  try {
    // Connect to the database
    await db.sequelize.authenticate();
    console.log('Database connected.');

    // Synchronize models with the database
    await db.sequelize.sync();
    console.log('Database synchronized.');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });

    // Connect to Polkadot
    const api = await connectPolkadot();

    // Fetch historical bounties once at startup
    await fetchHistoricalData(api, db);

    // Subscribe to new bounty-related events
    subscribeToBountyEvents(api, db);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Function to subscribe to bounty-related events
const subscribeToBountyEvents = (api, db) => {
  api.query.system.events((events) => {
    events.forEach(async ({ event }) => {
      if (event.section === 'bounties') {
        console.log(`\nProcessing event: ${event.method}`);
        console.log('Raw event data:', event.data.toHuman());

        if (event.method === 'BountyProposed') {
          const [bountyIndex, maybeBounty] = event.data.toArray();
          const bountyId = bountyIndex.toString();
          const proposer = maybeBounty.proposer.toString();
          const value = maybeBounty.value.toString();
          const description = maybeBounty.description.toString();

          try {
            await db.Bounty.findOrCreate({
              where: { id: bountyId },
              defaults: {
                proposer,
                value,
                description,
                status: 'Proposed',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
            console.log(`BountyProposed: ID ${bountyId}`);
          } catch (error) {
            console.error(`Error creating bounty ID ${bountyId}:`, error);
          }
        }

        if (event.method === 'ChildBountyCreated') {
          const [parentBountyIndex, childBounty] = event.data.toArray();
          const parentBountyId = parentBountyIndex.toString();
          const childBountyId = childBounty.id.toString();
          const proposer = childBounty.proposer.toString();
          const value = childBounty.value.toString();
          const description = childBounty.description.toString();

          try {
            await db.ChildBounty.findOrCreate({
              where: { id: childBountyId },
              defaults: {
                bountyId: parentBountyId,
                proposer,
                value,
                description,
                status: 'Created',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
            console.log(`ChildBountyCreated: ID ${childBountyId} for Parent ID ${parentBountyId}`);
          } catch (error) {
            console.error(`Error creating child bounty ID ${childBountyId}:`, error);
          }
        }
      }
    });
  }).catch((error) => {
    console.error('Error subscribing to events:', error);
  });
};

startServer();
