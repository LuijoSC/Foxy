module.exports = function(sequelize, DataTypes) {
    var Quote = sequelize.define ("Quote", {
      quoteId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
      },
      quoteText: {
          type: DataTypes.TEXT,
          allowNull: false
      }
  }, {freezeTableName: true});
  // Generating tables asociation 
//   quote.associate =  function(models) {
//       quote.belongsTo(Users_fx, {
//           foreignKey: 'userId'
//       });
//   };
  return Quote;
  };