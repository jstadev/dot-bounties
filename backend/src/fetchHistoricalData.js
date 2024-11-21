const fetchHistoricalData = async (api, db) => {
  try {
    console.log('Fetching historical BountyProposed and ChildBountyCreated events...');

    // Fetch the latest finalized block number
    const finalizedHead = await api.rpc.chain.getFinalizedHead();
    const lastHeader = await api.rpc.chain.getHeader(finalizedHead);
    const lastBlockNumber = lastHeader.number.toNumber();
    console.log(`Latest finalized block number: ${lastBlockNumber}`);

    // Define the range: last 10000 blocks
    const range = 10000;
    const startBlock = Math.max(0, lastBlockNumber - range);

    for (let blockNumber = startBlock; blockNumber <= lastBlockNumber; blockNumber++) {
      try {
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const events = await api.query.system.events.at(blockHash);

        for (const { event } of events) {
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
        }

        // Optional: Log progress every 1000 blocks
        if (blockNumber % 1000 === 0) {
          console.log(`Processed block number: ${blockNumber}`);
        }
      } catch (blockError) {
        console.error(`Error processing block number ${blockNumber}:`, blockError);
      }
    }

    console.log('Finished fetching historical data.');
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
};

module.exports = fetchHistoricalData;
