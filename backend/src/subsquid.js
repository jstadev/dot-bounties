// backend/src/subsquid.js

const axios = require('axios');

const SUBSQUID_ENDPOINT = process.env.SUBSQUID_ENDPOINT;

/**
 * GraphQL queries to fetch bounties and child bounties
 */
const GET_ALL_BOUNTIES = `
  query {
    bounties(limit: 1000, orderBy: index_ASC) {
      id: index
      proposer
      value: reward
      status
      description
      createdAt
    }
  }
`;

const GET_ALL_CHILD_BOUNTIES = `
  query {
    childBounties(limit: 1000, orderBy: id_ASC) {
      id: index
      parentBountyId
      proposer: beneficiary
      value: reward
      status
      description
      createdAt
    }
  }
`;

/**
 * Fetches all bounties and child bounties from Subsquid.
 */
const fetchBountiesFromSubsquid = async () => {
  try {
    // Fetch all parent bounties
    const bountyResponse = await axios.post(SUBSQUID_ENDPOINT, {
      query: GET_ALL_BOUNTIES,
    });
    const bounties = bountyResponse.data.data.bounties;

    // Fetch all child bounties
    const childBountyResponse = await axios.post(SUBSQUID_ENDPOINT, {
      query: GET_ALL_CHILD_BOUNTIES,
    });
    const childBounties = childBountyResponse.data.data.childBounties;

    return { bounties, childBounties };
  } catch (error) {
    console.error('Error fetching bounties from Subsquid:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { fetchBountiesFromSubsquid };
