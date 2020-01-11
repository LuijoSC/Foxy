$(document).ready(function() {
    // Getting jQuery references to the task description, info, form
    var DescriptionInput = $("#task-description");
    var taskInput = $("#task-info");
    var taskForm = $("#task");
  
    // Adding an event listener for when the form is submitted
    $(taskForm).on("submit", handleFormSubmit);
    // Gets the part of the url that comes after the "?" (which we have if we're updating a task)
    var url = window.location.search;
    var taskId;
  
    // Sets a flag for whether or not we're updating a task to be false initially
    var updating = false;
  
    // If we have this section in our url, we pull out the task id from the url
    // In '?task_id=1', taskId is 1
    if (url.indexOf("?task_id=") !== -1) {
      taskId = url.split("=")[1];
      getTaskData(taskId, "task");
    }
  
    // A function for handling what happens when the form to create a new task is submitted
    function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the task if we are missing a info or description
      if (!taskInput.val().trim() || !DescriptionInput.val().trim()) {
        return;
      }
      // Constructing a newTask object to hand to the database
      var newTask = {
        title: taskInput
          .val()
          .trim(),
        description: DescriptionInput
          .val()
          .trim(),
        userId: 1
          .val()
          .trim(),
        taskChkd: false,
        createdAt: Date.today(),
        updatedAt: Date.today()
      };
  
      // If we're updating a task run updateTask to update a task
      // Otherwise run submitTask to create a whole new task
      if (updating) {
        newTask.id = taskId;
        updateTask(newTask);
      }
      else {
        submitTask(newTask);
      }
    }
  
    // Submits a new task and brings user to task page upon completion
    function submitTask(task) {
      $.task("/api/tasks", task, function() {
        window.location.href = "/task";
      });
    }
  
    // Gets task data for the current task if we're editing
    function getTaskData(id, type) {
      var queryUrl;
      switch (type) {
      case "task":
        queryUrl = "/api/tasks/" + id;
        break;
      default:
        return;
      }
      $.get(queryUrl, function(data) {
        if (data) {
          // If this task exists, prefill our task forms with its data
          taskInput.val(data.text);
          DescriptionInput.val(data.description);
          // If we have a task with this id, set a flag for us to know to update the task
          // when we hit submit
          updating = true;
        }
      });
    }
  
    // Update a given task, bring user to the task page when done
    function updateTask(task) {
      $.ajax({
        method: "PUT",
        url: "/api/tasks",
        data: task
      })
        .then(function() {
          window.location.href = "/task";
        });
    }
  });
  