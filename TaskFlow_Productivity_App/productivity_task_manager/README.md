# TaskFlow — Productivity Task Manager

A responsive, browser-based task manager built with HTML, CSS and vanilla JavaScript. It does not need a backend, framework, package installation or server.

## Features
- Create, view, edit and delete tasks (CRUD).
- Categorize tasks as Work, Personal or Study.
- Optional due dates with overdue indication.
- Mark tasks complete or active.
- Filter by All, Active and Completed.
- Search task names and categories.
- Dashboard counts for total, active and completed tasks.
- Data is saved in browser `localStorage` and restored after reload.
- Responsive layout and small completion/removal animations.

## Run the project
1. Extract the ZIP file.
2. Open the `productivity_task_manager` folder.
3. Double-click `index.html`, or open it using VS Code and Live Server.
4. Add tasks using the form.

No `npm install` or backend is required.

## Project files
- `index.html` — page structure and form controls.
- `style.css` — responsive styling, task cards and animations.
- `script.js` — task state, CRUD operations, filters and localStorage.

## How persistence works
The app stores the task array as JSON under the key `taskflow_tasks_v1`:
- `saveToLocalStorage()` converts the array to JSON and calls `localStorage.setItem()`.
- `loadFromLocalStorage()` reads the saved string, parses the JSON and restores the array.
- The browser keeps localStorage data across page reloads and browser sessions for the same origin.

## Important note
This is local, browser-specific storage. Tasks are not synced to another device or shared between users. Clearing browser site data can remove the saved tasks. Do not store sensitive information in this demo app.
