var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // Load task page and pass in a task by id
  app.get("/task/:id", (req, res) => {
    db.Task.findOne({ where: { id: req.params.id } }).then(function(dbTask) {
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
