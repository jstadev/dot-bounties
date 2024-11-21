import React from 'react';
import './Analytics.css';

const Analytics = ({ totalBounties, totalParentDOT, totalChildDOT, totalChildBounties, statusCounts }) => {
  return (
    <div className="analytics-container">
      <h2>Analytics</h2>
      <div className="analytics-stats">
        <div className="stat">
          <strong>Total Bounties:</strong> {totalBounties}
        </div>
        <div className="stat">
          <strong>Total Parent DOT:</strong> {totalParentDOT.toLocaleString()} DOT
        </div>
        <div className="stat">
          <strong>Total Child DOT:</strong> {totalChildDOT.toLocaleString()} DOT
        </div>
        <div className="stat">
          <strong>Total Child Bounties:</strong> {totalChildBounties}
        </div>
      </div>
      <div className="status-counts">
        <h3>Child Bounties by Status</h3>
        <ul>
          {Object.entries(statusCounts).map(([status, count]) => (
            <li key={status}>
              <strong>{status}:</strong> {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
