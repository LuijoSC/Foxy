var db = require("../models");

module.exports = function (app) {
  // Get all tasks
  app.get("/api/tasks", function (req, res) {
    db.Task.findAll({}).then(function (dbTasks) {
      res.json(dbTasks);
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
