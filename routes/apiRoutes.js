var db = require("../models");
var moment = require("moment");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

module.exports = function (app) {
  // Get all tasks
  app.get("/api/tasks", function (req, res) {
    db.Task.findAll({}).then(function (dbTasks) {
      res.json(dbTasks);
    });
  });

  // Get tasks for a certain date
  app.get("/api/searchDay", function (req, res) {
    var initialTime = moment(req.query.initialTime).toDate();
    var finalTime = moment(req.query.finalTime).toDate();
    console.log(initialTime);
    console.log(finalTime);

    db.Task.findAll({
      where: {
        createdAt: {
          [Op.between]: [initialTime, finalTime]
        }
      }
    }).then(function (dbTask) {
      res.json(dbTask);
    });
  });

  // Create a new task
  app.post("/api/tasks", function (req, res) {
    db.Task.create(req.body).then(function (dbTask) {
      res.json(dbTask);
    });
  });

  // Delete a task by id
  app.delete("/api/tasks/:taskId", function (req, res) {
    db.Task.destroy({ where: { taskId: req.params.taskId } }).then(function (dbTask) {
      res.json(dbTask);
    });
  });
};
