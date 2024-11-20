module.exports = (sequelize, DataTypes) => {
    const Meal = sequelize.define('Meal', {
      mealID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(512),
        allowNull: true
      },
      isDinner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      dayOfWeek: {
        type: DataTypes.STRING(56),
        allowNull: true
      },
      spotsTaken: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'meal',
      timestamps: false
    });
  
    Meal.associate = models => {
      Meal.hasMany(models.RSVP, {
        foreignKey: 'mealID'
      });
    };
  
    return Meal;
  };
  