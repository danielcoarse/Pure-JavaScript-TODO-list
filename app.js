"use strict";
(function () {
  // UI Elements
  const form = document.forms.addTask;
  const listContainer = document.querySelector(".list-group");
  const taskListSection = document.querySelector(".tasks-list-section");
  const allBtn = document.getElementById("all-btn");
  const incBtn = document.getElementById("incomplete-btn");
  const allBage = document.getElementById("all-badge");
  const incBage = document.getElementById("inc-badge");

  let objOfTasks = {};
  let incompleteObj = {};

  objOfTasks = JSON.parse(localStorage.getItem("tasks"));
  console.log(objOfTasks);

  generateAllTasks(objOfTasks);
  checkTaskOnCompleted(objOfTasks, incompleteObj);
  tasksCounter(objOfTasks, allBage);
  tasksCounter(incompleteObj, incBage);

  // Events
  form.addEventListener("submit", onSubmitHandler);
  listContainer.addEventListener("click", onDeleteHandler);
  listContainer.addEventListener("click", onCompleteHandler);
  allBtn.addEventListener("click", onAllBageHandler);
  incBtn.addEventListener("click", onIncompleteBageHandler);

  /**
   * Generate function =================================================>
   */

  function generateAllTasks(objOfTasks) {
    const emptyObj = ObjIsEmpty(objOfTasks);
    showEmptyAlert(emptyObj);

    Object.values(objOfTasks).forEach((el) => {
      const item = generateListItems(el);
      listContainer.appendChild(item);
    });
  }

  function generateIncompleteTasks() {
    const incompleteObj = JSON.parse(localStorage.getItem("incomplete"));
    Object.values(incompleteObj).forEach((el) => {
      const item = generateListItems(el);
      listContainer.appendChild(item);
    });
  }

  // Creating List Items (DOM)
  function generateListItems(el) {
    const li = document.createElement("li");
    const title = document.createElement("span");
    const completeBtn = document.createElement("button");
    const remBtn = document.createElement("button");
    const body = document.createElement("p");

    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    remBtn.classList.add("btn", "btn-danger", "delete-btn");
    completeBtn.classList.add(
      "btn",
      "btn-success",
      "ml-auto",
      "mr-2",
      "complete-btn"
    );
    body.classList.add("mt-2", "w-100");

    remBtn.textContent = "Delete Task";
    completeBtn.textContent = "Complete";

    title.style.fontWeight = "bold";

    li.appendChild(title);
    li.appendChild(completeBtn);
    li.appendChild(remBtn);
    li.appendChild(body);

    title.textContent = el.title;
    body.textContent = el.body;

    li.dataset.id = el._id;

    return li;
  }

  /**
   * Main functions =================================================>
   */

  // Check tasks on completed
  function checkTaskOnCompleted(objOfTasks, incompleteObj) {
    Object.values(objOfTasks).forEach((el) => {
      let isCompleted = el.completed;
      if (isCompleted) {
        markCompletedTask(el);
      } else {
        incompleteObj[el._id] = el;
        localStorage.setItem("incomplete", JSON.stringify(incompleteObj));
      }
    });
  }

  function markCompletedTask(el) {
    const id = el._id;
    const child = listContainer.children;
    [...child].forEach((el) => {
      el.getAttribute("data-id");
      if (el.getAttribute("data-id") == id) {
        el.classList.add("completed");
      }
    });
  }

  // Checking an object for emptiness
  function ObjIsEmpty(objOfTasks) {
    for (let key in objOfTasks) {
      return false;
    }
    return true;
  }

  // Create a no-miss message
  function creatEmptyAlert() {
    const sectionNoTasks = document.createElement("div");
    const container = document.createElement("div");
    const row = document.createElement("div");
    const col = document.createElement("div");
    const alert = document.createElement("div");

    sectionNoTasks.classList.add("no-tasks-section", "mt-4");
    container.classList.add("container");
    row.classList.add("row");
    col.classList.add("col-xl-6", "col-md-6", "col-8", "mx-auto");
    alert.classList.add("alert", "alert-info");

    alert.setAttribute("role", "alert");

    alert.textContent = "You don't have tasks =)";

    sectionNoTasks.appendChild(container);
    container.appendChild(row);
    row.appendChild(col);
    col.appendChild(alert);

    return sectionNoTasks;
  }

  // Show / Hide Missing Tasks
  function showEmptyAlert(emptyObj) {
    const emptyAlert = creatEmptyAlert();
    if (emptyObj) {
      document.body.insertBefore(emptyAlert, taskListSection);
    }
    if (!emptyObj) {
      const alert = document.querySelector(".no-tasks-section");
      if (!alert) {
        return;
      } else {
        alert.remove();
      }
    }
  }

  // Tasks Counter
  function tasksCounter(obj, bageName) {
    if (Object.values(obj).length == 0) disableBage(bageName, obj);
    if (Object.values(obj).length > 0) enableBage(bageName, obj);
  }

  function disableBage(bageName, obj) {
    const parent = bageName.closest(".btn");
    bageName.textContent = Object.values(obj).length;
    parent.classList.add("disabled");
    parent.style.pointerEvents = "none";
  }

  function enableBage(bageName, obj) {
    bageName.textContent = Object.values(obj).length;
    const parent = bageName.closest(".btn");
    parent.classList.remove("disabled");
    parent.style.pointerEvents = "auto";
  }

  // Get objects
  function getIncompleteObj() {
    return JSON.parse(localStorage.getItem("incomplete"));
  }

  function getAllObj() {
    return JSON.parse(localStorage.getItem("tasks"));
  }

  /**
   * Handlers =================================================>
   */

  // Add Task Handler
  function onSubmitHandler(e) {
    e.preventDefault();

    if (!form.title.value || !form.body.value) {
      alert("Please, enter title and body");
      return;
    }

    const formValues = {
      _id: Math.random(),
      title: form.title.value,
      body: form.body.value,
      completed: false,
    };

    objOfTasks[formValues._id] = formValues;
    incompleteObj[formValues._id] = formValues;
    localStorage.setItem("tasks", JSON.stringify(objOfTasks));
    localStorage.setItem("incomplete", JSON.stringify(incompleteObj));

    const item = generateListItems(formValues);
    listContainer.insertAdjacentElement("beforeend", item);

    const emptyObj = ObjIsEmpty(objOfTasks);
    showEmptyAlert(emptyObj);

    form.reset();

    tasksCounter(objOfTasks, allBage);
    tasksCounter(incompleteObj, incBage);
  }

  // Complete handler
  function onCompleteHandler({ target }) {
    if (target.classList.contains("complete-btn")) {
      const targetParent = target.closest("[data-id]");
      targetParent.classList.toggle("completed");

      let isComplete = false;

      if (targetParent.classList.contains("completed")) isComplete = true;

      const id = targetParent.dataset.id;
      objOfTasks[id].completed = isComplete;

      localStorage.setItem("tasks", JSON.stringify(objOfTasks));

      const status = objOfTasks[id].completed;

      if (!status) checkTaskOnCompleted(objOfTasks, incompleteObj);

      if (status) {
        Object.values(incompleteObj).forEach((el) => {
          if (el._id == id) {
            delete incompleteObj[id];
          }
        });
        localStorage.setItem("incomplete", JSON.stringify(incompleteObj));
      }
    }

    if (
      target.classList.contains("complete-btn") &&
      target.closest("[data-status]")
    ) {
      const targetParent = target.closest("[data-id]");
      const cont = target.closest("[data-status]")
      const isTarget = cont.lastChild;
      targetParent.remove();

      if (isTarget == targetParent) {
        console.log("done");
        onAllBageHandler();
      }
    }

    tasksCounter(objOfTasks, allBage);
    tasksCounter(incompleteObj, incBage);
  }

  // Task Delete Handler
  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn") && !target.closest("[data-status]")) {
      const targetParent = target.closest("[data-id]");
      const id = targetParent.dataset.id;
      const titleID = objOfTasks[id].title;
      const answer = confirm(`Delete task: ${titleID} ?`);

      if (!answer) return;
      targetParent.remove();

      delete objOfTasks[id];
      delete incompleteObj[id];

      localStorage.setItem("tasks", JSON.stringify(objOfTasks));
      localStorage.setItem("incomplete", JSON.stringify(incompleteObj));

      const emptyObj = ObjIsEmpty(objOfTasks);

      showEmptyAlert(emptyObj);
    }

    if (
      target.classList.contains("delete-btn") &&
      target.closest("[data-status]")
    ) {
      const targetParent = target.closest("[data-id]");
      const cont = target.closest("[data-status]")
      const isTarget = cont.lastChild;
      const id = targetParent.dataset.id;
      const titleID = objOfTasks[id].title;
      const answer = confirm(`Delete task: ${titleID} ?`);

      if (!answer) return;
      targetParent.remove();

      delete objOfTasks[id];
      delete incompleteObj[id];

      localStorage.setItem("tasks", JSON.stringify(objOfTasks));
      localStorage.setItem("incomplete", JSON.stringify(incompleteObj));

      if (isTarget == targetParent) {
        console.log("done");
        onAllBageHandler();
      }
    }

    tasksCounter(objOfTasks, allBage);
    tasksCounter(incompleteObj, incBage);

  }

  // Incomplete bage handler
  function onIncompleteBageHandler() {
    this.classList.remove("btn-outline-primary");
    this.classList.add("btn-primary");
    allBtn.classList.remove("btn-primary");
    allBtn.classList.add("btn-outline-primary");
    [...listContainer.children].forEach((el) => {
      el.remove();
    });
    const all = getAllObj();
    const inc = getIncompleteObj();
    generateIncompleteTasks(inc);
    listContainer.setAttribute("data-status", "incomplete");
    tasksCounter(inc, incBage);
    tasksCounter(all, allBage);
  }

  // All bage handler
  function onAllBageHandler() {
    allBtn.classList.remove("btn-outline-primary");
    allBtn.classList.add("btn-primary");
    incBtn.classList.remove("btn-primary");
    incBtn.classList.add("btn-outline-primary");
    [...listContainer.children].forEach((el) => {
      el.remove();
    });
    const all = getAllObj();
    const inc = getIncompleteObj();
    generateAllTasks(all);
    checkTaskOnCompleted(all, inc);
    listContainer.removeAttribute("data-status");
    tasksCounter(all, allBage);
    tasksCounter(inc, incBage);
  }
})();
