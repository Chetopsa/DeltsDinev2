module.exports = (sequelize, DataTypes) => {
    const RSVP = sequelize.define('RSVP', {
      rsvpID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mealID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'meal',
          key: 'mealID'
        }
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'userID'
        }
      }
    }, {
      tableName: 'rsvp',
      timestamps: false
    });
  
    RSVP.associate = models => {
      RSVP.belongsTo(models.User, {
        foreignKey: 'userID'
      });
      RSVP.belongsTo(models.Meal, {
        foreignKey: 'mealID'
      });
    };
  
    return RSVP;
  };
  