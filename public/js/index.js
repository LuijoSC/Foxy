const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector(".date-picker .dates");
const mth_element = document.querySelector(".date-picker .dates .month .mth");
const next_mth_element = document.querySelector(".date-picker .dates .month .next-mth");
const prev_mth_element = document.querySelector(".date-picker .dates .month .prev-mth");
const days_element = document.querySelector(".date-picker .dates .days");

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let selectedDate = currentDate;
let selectedDay = currentDay;
let selectedMonth = currentMonth;
let selectedYear = currentYear;

mth_element.textContent = `${months[currentMonth]} ${currentYear}`;

selected_date_element.textContent = formatDate(currentDate);
selected_date_element.dataset.value = moment.utc(selectedDate).format('YYYY-MM-DD HH:mm:ss');

// Event listeners
date_picker_element.addEventListener('click', toggleDatePicker);
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPreviousMonth)

populateDates();
// Functions
function toggleDatePicker(e) {
  if (!checkEventPathForClass(e.path, 'dates')) {
    dates_element.classList.toggle('active');
  }
}

function goToNextMonth(e) {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  mth_element.textContent = `${months[currentMonth]} ${currentYear}`;
  populateDates();
}

function goToPreviousMonth(e) {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  mth_element.textContent = `${months[currentMonth]} ${currentYear}`;
  populateDates();
}

function populateDates(e) {
  days_element.innerHTML = '';
  if (currentYear % 4 == 0) {
    daysInMonth.splice(1, 1, 29);
  } else {
    daysInMonth.splice(1, 1, 28);
  }

  let mod = zeller(currentMonth, currentYear);
  for (let i = 0; i < mod; i++) {
    const day_element = document.createElement('div');
    day_element.textContent = "";
    days_element.appendChild(day_element)
  }

  for (let j = 0; j < daysInMonth[currentMonth]; j++) {
    const day_element = document.createElement('div');
    day_element.classList.add('day');
    day_element.textContent = j + 1;

    if (selectedDay == (j + 1) && selectedYear == currentYear && selectedMonth == currentMonth) {
      day_element.classList.add('selected');
    }

    day_element.addEventListener('click', function () {
      selectedDay = parseInt(this.textContent);
      selectedMonth = parseInt(currentMonth);
      selectedYear = parseInt(currentYear);
      selectedDate = new Date(`${selectedYear}-${selectedMonth + 1}-${parseInt(this.textContent)} `);
      selected_date_element.textContent = formatDate(selectedDate);
      selected_date_element.dataset.value = moment.utc(selectedDate).format('YYYY-MM-DD HH:mm:ss');
      queryDate = {
        initialTime: moment(selected_date_element.dataset.value).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
        finalTime: moment(selected_date_element.dataset.value).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
      };
      retrieveTasks(queryDate);

      populateDates();
    });

    days_element.appendChild(day_element);
  }
}

// Helper functions
function checkEventPathForClass(path, selector) {
  for (let i = 0; i < path.length; i++) {
    if (path[i].classList && path[i].classList.contains(selector)) {
      return true;
    }
  }
  return false;
}

function formatDate(d) {
  let day = d.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let month = d.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let year = d.getFullYear();

  return `${day} / ${month} / ${year}`;
}

function zeller(month, year) {
  // March is considered month 1
  if (month > 1) {
    month = month - 1;
  } else if (month === 1) {
    month = 12;
    year = year - 1;
  } else {
    month = 11;
    year = year - 1;
  }
  var last2 = year.toString().slice(-2);
  last2 = parseInt(last2);
  var century = year.toString().slice(0, 2);
  century = parseInt(century);
  var day = 1;
  var century = 20;
  var f = day + (Math.floor((13 * month - 1) / 5)) + last2 + Math.floor(last2 / 4) + Math.floor(century / 4) + 5 * century;
  var mod = Math.floor(f % 7);
  switch (mod) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 6
  }
}

// Get references to page elements
var $taskText = $("#task-text");
var $taskDescription = $("#task-description");
var $submitBtn = $("#submit");
var $taskList = $("#task-list");
var todayTasks = $("#today-tasks");


// The API object contains methods for each kind of request we'll make
var API = {
  saveTask: function (task) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/tasks",
      data: JSON.stringify(task)
    });
  },
  getTasks: function () {
    return $.ajax({
      url: "api/tasks",
      type: "GET"
    });
  },
  deleteTasks: function (id) {
    return $.ajax({
      url: "api/tasks/" + id,
      type: "DELETE"
    });
  },
  getTasksByDate: function (query) {
    return $.ajax({
      url: "api/searchDay",
      type: "GET",
      data: query
    })
  }
};

// refreshTasks gets new tasks from the db and repopulates the list
var refreshTasks = function () {
  API.getTasks().then(function (data) {
    var $tasks = data.map(function (task) {
      var $a = $("<a>")
        .text(task.taskInfo)
        .attr("href", "/task/" + task.taskId);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": task.taskId
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

refreshTasks();

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var task = {
    taskInfo: $taskText.val().trim(),
    taskDescription: $taskDescription.val().trim()
  };

  // if (!(task.text && task.description)) {
  //   alert("You must enter a task text and description!");
  //   return;
  // }
  // console.log(task);

  API.saveTask(task).then(function () {
    refreshTasks();
  });

  $taskText.val("");
  $taskDescription.val("");
};

// handleDeleteBtnClick is called when an task's delete button is clicked
// Remove the task from the db and refresh the list
var handleDeleteBtnClick = function () {
  var taskId = $(this)
    .parent()
    .attr("data-id");

  API.deleteTasks(taskId).then(function () {
    refreshTasks();
  });
};


// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$taskList.on("click", ".delete", handleDeleteBtnClick);

var queryDate = {
  initialTime: moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
  finalTime: moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
};

retrieveTasks = function (date) {
  API.getTasksByDate(date);
}

window.onload = retrieveTasks(queryDate);