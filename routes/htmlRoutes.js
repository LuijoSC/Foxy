var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", (req, res) => {
    res.render("index");
  });

  // Load task page and pass in a task by id
  app.get("/task/:taskId", (req, res) => {
    db.Task.findOne({ where: { taskId: req.params.taskId } }).then(function (dbTask) {
      res.render("task", {
        task: dbTask
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => {
    res.render("404");
  });
};
