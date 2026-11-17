const STORAGE_KEY = "taskflow_tasks_v1";

let tasks = loadFromLocalStorage();
let currentFilter = "all";
let searchTerm = "";
let toastTimer;

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskDueDate = document.getElementById("taskDueDate");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    showToast("Unable to save. Check browser storage settings.");
  }
}

function createTask(title, category, dueDate) {
  return {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title: title.trim(),
    category,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function addTask(event) {
  event.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) {
    showToast("Please enter a task name.");
    taskTitle.focus();
    return;
  }
  tasks.unshift(createTask(title, taskCategory.value, taskDueDate.value));
  saveToLocalStorage();
  taskForm.reset();
  taskTitle.focus();
  renderTasks();
  showToast("Task added successfully.");
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
  saveToLocalStorage();
  renderTasks();
}

function deleteTask(id) {
  const item = taskList.querySelector(`[data-id="${CSS.escape(id)}"]`);
  if (item) item.classList.add("removing");
  window.setTimeout(() => {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
    showToast("Task deleted.");
  }, 180);
}

function openEditDialog(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  document.getElementById("editId").value = task.id;
  document.getElementById("editTitle").value = task.title;
  document.getElementById("editCategory").value = task.category;
  document.getElementById("editDueDate").value = task.dueDate || "";
  editDialog.showModal();
  document.getElementById("editTitle").focus();
}

function updateTask(event) {
  event.preventDefault();
  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value.trim();
  if (!title) return;
  tasks = tasks.map(task => task.id === id ? {
    ...task,
    title,
    category: document.getElementById("editCategory").value,
    dueDate: document.getElementById("editDueDate").value
  } : task);
  saveToLocalStorage();
  editDialog.close();
  renderTasks();
  showToast("Task updated.");
}

function getVisibleTasks() {
  return tasks.filter(task => {
    const matchesFilter = currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);
    const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
      task.category.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
}

function formatDueDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {day: "numeric", month: "short", year: "numeric"});
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = "";

  visibleTasks.forEach(task => {
    const item = document.createElement("article");
    item.className = `task-item${task.completed ? " completed" : ""}`;
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} ${task.completed ? "active" : "complete"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const main = document.createElement("div");
    main.className = "task-main";
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    const category = document.createElement("span");
    category.className = `category ${task.category}`;
    category.textContent = task.category;
    meta.appendChild(category);

    if (task.dueDate) {
      const due = document.createElement("span");
      const today = new Date(); today.setHours(0,0,0,0);
      const dueDay = new Date(`${task.dueDate}T00:00:00`);
      due.className = `due${!task.completed && dueDay < today ? " overdue" : ""}`;
      due.textContent = `Due ${formatDueDate(task.dueDate)}${!task.completed && dueDay < today ? " · Overdue" : ""}`;
      meta.appendChild(due);
    }
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    const edit = document.createElement("button");
    edit.type = "button"; edit.className = "icon-btn";
    edit.textContent = "✎"; edit.title = "Edit task"; edit.setAttribute("aria-label", `Edit ${task.title}`);
    edit.addEventListener("click", () => openEditDialog(task.id));
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "icon-btn";
    remove.textContent = "×"; remove.title = "Delete task"; remove.setAttribute("aria-label", `Delete ${task.title}`);
    remove.addEventListener("click", () => deleteTask(task.id));
    actions.append(edit, remove);
    item.append(checkbox, main, actions);
    taskList.appendChild(item);
  });

  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  document.getElementById("totalCount").textContent = total;
  document.getElementById("activeCount").textContent = active;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("visibleCount").textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;
  document.getElementById("footerSummary").textContent = total ? `${completed} of ${total} tasks completed` : "Stay focused. You've got this!";
  emptyState.classList.toggle("show", visibleTasks.length === 0);
  if (visibleTasks.length === 0) {
    emptyState.querySelector("h3").textContent = tasks.length === 0 ? "No tasks here yet" : "No matching tasks";
    emptyState.querySelector("p").textContent = tasks.length === 0
      ? "Add a task above and make your day productive."
      : "Try another filter or search term.";
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

taskForm.addEventListener("submit", addTask);
editForm.addEventListener("submit", updateTask);
searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderTasks();
});

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("active", btn === button));
    renderTasks();
  });
});

document.getElementById("clearCompleted").addEventListener("click", () => {
  const completedCount = tasks.filter(task => task.completed).length;
  if (!completedCount) {
    showToast("There are no completed tasks to clear.");
    return;
  }
  if (!confirm(`Delete all ${completedCount} completed task(s)?`)) return;
  tasks = tasks.filter(task => !task.completed);
  saveToLocalStorage();
  renderTasks();
  showToast("Completed tasks cleared.");
});

renderTasks();
