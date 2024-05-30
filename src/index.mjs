const form = document.querySelector("#new-todo-form");
const todoInput = document.querySelector("#todo-input");
const list = document.querySelector("#list");
const LOCAL_STORAGE_PREFIX = "ADVANCED_TODO_LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
renderTodos();

let currentEditingTodo = null;

list.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox]")) return;

  const parent = e.target.closest(".list-item");
  const todoId = parent.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  todo.complete = e.target.checked;
  saveTodos();
});

list.addEventListener("click", (e) => {
  if (e.target.matches("[data-button-change]")) {
    const parent = e.target.closest(".list-item");
    const todoId = parent.dataset.todoId;
    const todo = todos.find((t) => t.id === todoId);

    // Check if the current todo is being edited
    if (currentEditingTodo === parent) {
      // Hide the input and save button
      const changeInput = parent.querySelector("[data-change-input]");
      const saveButton = parent.querySelector("[data-button-save]");
      changeInput.style.display = "none";
      saveButton.style.display = "none";
      currentEditingTodo = null;
    } else {
      // Show the input and save button
      const changeInput = parent.querySelector("[data-change-input]");
      const saveButton = parent.querySelector("[data-button-save]");
      changeInput.value = todo.name;
      changeInput.style.display = "inline-block";
      saveButton.style.display = "inline-block";

      // If there's another todo being edited, hide its input and save button
      if (currentEditingTodo) {
        const oldEditingTodo = currentEditingTodo;
        const oldChangeInput = oldEditingTodo.querySelector(
          "[data-change-input]",
        );
        const oldSaveButton =
          oldEditingTodo.querySelector("[data-button-save]");
        oldChangeInput.style.display = "none";
        oldSaveButton.style.display = "none";
      }

      currentEditingTodo = parent;
    }
  } else if (e.target.matches("[data-button-save]")) {
    const parent = e.target.closest(".list-item");
    const todoId = parent.dataset.todoId;
    const todo = todos.find((t) => t.id === todoId);
    const changeInput = parent.querySelector("[data-change-input]");
    const newTodoName = changeInput.value.trim();
    if (newTodoName !== "") {
      todo.name = newTodoName;
      const textElement = parent.querySelector("[data-list-item-text]");
      textElement.innerText = newTodoName;
      saveTodos();
      // Hide the input and save button
      changeInput.style.display = "none";
      parent.querySelector("[data-button-save]").style.display = "none";
      currentEditingTodo = null;
    }
  } else if (e.target.matches("[data-button-delete]")) {
    const parent = e.target.closest(".list-item");
    const todoId = parent.dataset.todoId;
    parent.remove();
    todos = todos.filter((todo) => todo.id !== todoId);
    saveTodos();
    renderTodos();
  }
});

function renderTodos() {
  list.innerHTML = "";
  todos.forEach(renderTodo);
}

function renderTodo(todo) {
  const listItem = document.createElement("li");
  listItem.dataset.todoId = todo.id;
  listItem.classList.add("list-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.complete;
  checkbox.dataset.listItemCheckbox = "";
  listItem.appendChild(checkbox);

  const textElement = document.createElement("span");
  textElement.dataset.listItemText = "";
  textElement.textContent = todo.name;
  listItem.appendChild(textElement);

  const changeButton = document.createElement("button");
  changeButton.textContent = "Change";
  changeButton.dataset.buttonChange = "";
  listItem.appendChild(changeButton);

  const changeInput = document.createElement("input");
  changeInput.type = "text";
  changeInput.dataset.changeInput = "";
  changeInput.style.display = "none";
  listItem.appendChild(changeInput);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.dataset.buttonSave = "";
  saveButton.style.display = "none";
  listItem.appendChild(saveButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.dataset.buttonDelete = "";
  listItem.appendChild(deleteButton);

  list.appendChild(listItem);
}

function loadTodos() {
  const todosJSON = localStorage.getItem(TODOS_STORAGE_KEY);
  return JSON.parse(todosJSON) || [];
}

function saveTodos() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoName = todoInput.value;
  if (todoName === "") return;
  const newTodo = {
    name: todoName,
    complete: false,
    id: new Date().valueOf().toString(),
  };
  todos.push(newTodo);
  renderTodo(newTodo);
  saveTodos();
  todoInput.value = "";
});
