import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BountyList.css';

const BountyList = () => {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bounties');
        setBounties(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bounties:', err);
        setError('Failed to fetch bounties.');
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  if (loading) return <p>Loading bounties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bounty-list">
      <h1>Polkadot Bounties</h1>
      {bounties.length === 0 ? (
        <p>No bounties found.</p>
      ) : (
        bounties.map((bounty) => (
          <div key={bounty.id} className="bounty-item">
            <h2>Bounty ID: {bounty.id}</h2>
            <p><strong>Proposer:</strong> {bounty.proposer}</p>
            <p><strong>Value:</strong> {bounty.value}</p>
            <p><strong>Description:</strong> {bounty.description}</p>
            <p><strong>Status:</strong> {bounty.status}</p>
            {bounty.childBounties && bounty.childBounties.length > 0 && (
              <div className="child-bounties">
                <h3>Child Bounties:</h3>
                {bounty.childBounties.map((child) => (
                  <div key={child.id} className="child-bounty-item">
                    <p><strong>Child Bounty ID:</strong> {child.id}</p>
                    <p><strong>Proposer:</strong> {child.proposer}</p>
                    <p><strong>Value:</strong> {child.value}</p>
                    <p><strong>Description:</strong> {child.description}</p>
                    <p><strong>Status:</strong> {child.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BountyList;
