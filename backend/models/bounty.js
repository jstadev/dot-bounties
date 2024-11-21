module.exports = (sequelize, DataTypes) => {
  const Bounty = sequelize.define('Bounty', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    proposer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Proposed',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Bounty.associate = (models) => {
    Bounty.hasMany(models.ChildBounty, {
      foreignKey: 'bountyId',
      as: 'childBounties',
    });
  };

  return Bounty;
};
