// Simple TaskEase app (no frameworks) — tasks saved in localStorage

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const clearCompleted = document.getElementById("clearCompleted");
const clearAll = document.getElementById("clearAll");

let tasks = [];

// load from localStorage
function load() {
  const raw = localStorage.getItem("taskease_tasks");
  if (raw) {
    try {
      tasks = JSON.parse(raw);
    } catch (e) {
      tasks = [];
    }
  } else {
    tasks = [];
  }
  render();
}

// save to localStorage
function save() {
  localStorage.setItem("taskease_tasks", JSON.stringify(tasks));
}

// create a DOM element for a task
function createTaskNode(task, index) {
  const li = document.createElement("li");
  li.className = "task-item";

  const left = document.createElement("div");
  left.className = "task-left";

  const cb = document.createElement("div");
  cb.className = "checkbox";
  cb.title = "Mark complete";
  cb.innerHTML = task.completed ? "✓" : "";

  cb.addEventListener("click", () => {
    tasks[index].completed = !tasks[index].completed;
    save();
    render();
  });

  const span = document.createElement("div");
  span.className = "task-text" + (task.completed ? " completed" : "");
  span.textContent = task.text;

  left.appendChild(cb);
  left.appendChild(span);

  const del = document.createElement("button");
  del.className = "delete";
  del.title = "Delete task";
  del.textContent = "❌";
  del.addEventListener("click", () => {
    tasks.splice(index, 1);
    save();
    render();
  });

  li.appendChild(left);
  li.appendChild(del);
  return li;
}

// render tasks to UI
function render() {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
    tasks.forEach((t, i) => {
      taskList.appendChild(createTaskNode(t, i));
    });
  }
}

// add new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }
  tasks.push({ text, completed: false, createdAt: new Date().toISOString() });
  taskInput.value = "";
  save();
  render();
}

// clear completed tasks
clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
});

// clear all tasks (quick demo-only confirmation)
clearAll.addEventListener("click", () => {
  if (confirm("Clear ALL tasks? This cannot be undone.")) {
    tasks = [];
    save();
    render();
  }
});

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// initial load
load();
