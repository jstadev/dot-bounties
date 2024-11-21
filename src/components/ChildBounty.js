import React from 'react';
import './BountiesList.css';

const ChildBounty = ({ childBounty }) => {
  const formattedValue = (Number(childBounty.value) / 1e10).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <li className="child-bounty-item">
      <p>
        <strong>Bounty ID:</strong> {childBounty.id}
      </p>
      <p>
        <strong>Proposer:</strong> {childBounty.proposer || 'N/A'}
      </p>
      <p>
        <strong>Value:</strong> {formattedValue} DOT
      </p>
      <p>
        <strong>Status:</strong> {childBounty.status}
      </p>
      {childBounty.description && (
        <p>
          <strong>Description:</strong> {childBounty.description}
        </p>
      )}
      <p>
        <strong>Claimed:</strong> {childBounty.claimed ? 'Yes' : 'No'}
      </p>
    </li>
  );
};

export default ChildBounty;
