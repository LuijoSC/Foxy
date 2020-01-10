var path = require("path");
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

  // Tasks page
  app.get("/tasks", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/tasks.html"));
});

// Quotes page
app.get("/quotes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/quotes.html"));
});

  // Render 404 page for any other case
  app.get("*", (req, res) => {
    res.render("404");
  });
};
