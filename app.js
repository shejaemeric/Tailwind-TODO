document.addEventListener("DOMContentLoaded", function () {
  const addTaskForm = document.getElementById("add-task-form");
  const taskList = document.getElementById("task-list");
  const createButton = document.getElementById("create-button");
  const updateButton = document.getElementById("update-button");

  // Load and display tasks when the page loads
  loadAndDisplayTasks();

  // Add task form submission handler
  addTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const dueDate = document.getElementById("task-due-date").value;

    if (title && description && dueDate) {
      const task = { title, description, dueDate, completed: false };
      saveTaskToLocalStorage(task);
      addTaskToDOM(task);
      addTaskForm.reset();
    } else {
      alert("Please enter all task information.");
    }
  });

  // Functions for task display

  function loadAndDisplayTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => addTaskToDOM(task));
  }

  function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.classList.add("flex", "items-center", "justify-between", "py-2");

    const taskContent = document.createElement("span");
    taskContent.textContent = `${task.title} - ${task.description} - ${task.dueDate}`;
    taskContent.classList.add("mr-4");

    li.appendChild(taskContent);

    if (task.completed) {
      const completedText = document.createElement("p");
      completedText.textContent = "completed";
      completedText.classList.add("text-green", "mx-2");
      li.appendChild(completedText);
    } else {
      const completedButton = document.createElement("button");
      completedButton.textContent = "Complete";
      completedButton.classList.add(
        "bg-green-500",
        "text-white",
        "px-2",
        "py-1",
        "rounded",
        "mr-2"
      );
      completedButton.addEventListener("click", () => {
        markTaskAsComplete(task.id);
        reloadTaskList();
      });
      li.appendChild(completedButton);
    }

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.classList.add(
      "bg-blue-500",
      "text-white",
      "px-2",
      "py-1",
      "rounded",
      "mr-2"
    );
    updateButton.addEventListener("click", () => showTaskInForm(task.id));
    li.appendChild(updateButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add(
      "bg-red-500",
      "text-white",
      "px-2",
      "py-1",
      "rounded",
      "ml-2"
    );
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  }

  function showTaskInForm(id) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find((task) => task.id === id);

    document.getElementById("task-title").value = task.title;
    document.getElementById("task-description").value = task.description;
    document.getElementById("task-due-date").value = task.dueDate;

    createButton.classList.add("hidden");
    updateButton.classList.remove("hidden");

    updateButton.onclick = () => updateTask(task);
  }

  function updateTask(task) {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const dueDate = document.getElementById("task-due-date").value;

    if (title && description && dueDate) {
      const updatedTask = {
        id: task.id,
        title,
        description,
        dueDate,
        completed: task.completed,
      };
      saveUpdatedTaskToLocalStorage(updatedTask);
      reloadTaskList();
      addTaskForm.reset();
      createButton.classList.remove("hidden");
      updateButton.classList.add("hidden");
    } else {
      alert("Please fill all task information.");
    }
  }

  function deleteTask(id) {
    removeTaskFromLocalStorage(id);
    reloadTaskList();
  }

  function reloadTaskList() {
    taskList.innerHTML = "";
    loadAndDisplayTasks();
  }

  // Functions for local storage

  function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 0;
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  function saveUpdatedTaskToLocalStorage(updatedTask) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
    tasks[taskIndex] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function markTaskAsComplete(id) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function removeTaskFromLocalStorage(id) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }
});
