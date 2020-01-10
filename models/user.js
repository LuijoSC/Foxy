module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define ("users_fx", {
      userId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
      }
  }, {freezeTableName: true});
  // Generating tables asociation 
  // Task.associate =  function(models) {
  //     Task.belongsTo(Users_fx, {
  //         foreignKey: 'userId'
  //     });
  // };
  return User;
  };