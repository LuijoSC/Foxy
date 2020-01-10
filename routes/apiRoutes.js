var db = require("../models");

module.exports = function(app) {
  // Get all tasks
  app.get("/api/tasks", (req, res) => {
    db.tasks_fx.findAll({}).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  // Create a new task
  app.post("/api/tasks", (req, res) => {
    db.task_fx.create(req.body).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // Delete a task by id
  app.delete("/api/tasks/:id", (req, res) => {
    db.task_fx.destroy({ where: { taskId: req.params.id } }).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // Get all quotes
  app.get("/api/quotes", (req, res) => {
    db.quotes_fx.findAll({}).then(function(dbQuotes) {
      res.json(dbQuotes);
    })
  })
};
