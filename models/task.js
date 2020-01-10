module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define ("tasks_fx", {
    taskId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        foreignKey: true
    },
    taskInfo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    taskDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {freezeTableName: true});
// Generating tables asociation 
// Task.associate =  function(models) {
//     Task.belongsTo(Users_fx, {
//         foreignKey: 'userId'
//     });
// };
return Task;
};