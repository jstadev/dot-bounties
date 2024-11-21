// backend/src/routes/bounties.js
const express = require('express');
const router = express.Router();
const { Bounty, ChildBounty } = require('../../models');

// GET all parent bounties with their child bounties
router.get('/', async (req, res) => {
  try {
    const bounties = await Bounty.findAll({
      include: {
        model: ChildBounty,
        as: 'childBounties',
      },
      order: [['createdAt', 'DESC']],
    });
    res.json(bounties);
  } catch (error) {
    console.error('Error fetching bounties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific bounty by ID with its child bounties
router.get('/:id', async (req, res) => {
  try {
    const bounty = await Bounty.findByPk(req.params.id, {
      include: {
        model: ChildBounty,
        as: 'childBounties',
      },
    });
    if (!bounty) {
      return res.status(404).json({ error: 'Bounty not found' });
    }
    res.json(bounty);
  } catch (error) {
    console.error('Error fetching bounty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
