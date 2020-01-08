// Get references to page elements
var $taskText = $("#task-text");
var $taskDescription = $("#task-description");
var $submitBtn = $("#submit");
var $taskList = $("#task-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveTask: function(task) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/task",
      data: JSON.stringify(task)
    });
  },
  getTasks: function() {
    return $.ajax({
      url: "api/tasks",
      type: "GET"
    });
  },
  deleteTasks: function(id) {
    return $.ajax({
      url: "api/tasks/" + id,
      type: "DELETE"
    });
  }
};

// refreshTasks gets new tasks from the db and repopulates the list
var refreshTasks = function() {
  API.getTasks().then(function(data) {
    var $tasks = data.map(function(task) {
      var $a = $("<a>")
        .text(task.text)
        .attr("href", "/task/" + task.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": task.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $taskList.empty();
    $taskList.append($tasks);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var task = {
    text: $taskText.val().trim(),
    description: $taskDescription.val().trim()
  };

  if (!(task.text && task.description)) {
    alert("You must enter a task text and description!");
    return;
  }

  API.saveTask(task).then(function() {
    refreshTasks();
  });

  $taskText.val("");
  $taskDescription.val("");
};

// handleDeleteBtnClick is called when an task's delete button is clicked
// Remove the task from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteTask(idToDelete).then(function() {
    refreshTasks();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$taskList.on("click", ".delete", handleDeleteBtnClick);
