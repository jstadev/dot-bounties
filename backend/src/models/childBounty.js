// backend/models/childBounty.js
module.exports = (sequelize, DataTypes) => {
  const ChildBounty = sequelize.define('ChildBounty', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    bountyId: {
      type: DataTypes.STRING,
      allowNull: false,
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
      defaultValue: 'Created',
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

  ChildBounty.associate = (models) => {
    ChildBounty.belongsTo(models.Bounty, {
      foreignKey: 'bountyId',
      as: 'bounty',
    });
  };

  return ChildBounty;
};
