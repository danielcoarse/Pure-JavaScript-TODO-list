const tasks = [];

(function (arrOfTasks) {
  // UI Elements
  const form = document.forms.addTask;
  const listContainer = document.querySelector(".list-group");
  const taskListSection = document.querySelector(".tasks-list-section");

  // Array to object
  let objOfTasks = arrOfTasks.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});

  objOfTasks = JSON.parse(localStorage.getItem("tasks"));

  // Object element generation
  generateAllTasks(objOfTasks);

  // Events
  form.addEventListener("submit", onSubmitHandler);
  listContainer.addEventListener("click", onDeleteHandler);
  themeSelect.addEventListener("change", onThemeSelectHandler);

  function generateAllTasks(objOfTasks) {
    const emptyObj = ObjIsEmpty(objOfTasks);
    showEmptyAlert(emptyObj);

    Object.values(objOfTasks).forEach((el) => {
      const item = generateListItems(el);
      listContainer.appendChild(item);
    });
  }

  // Creating List Items
  function generateListItems(el) {
    const li = document.createElement("li");
    const title = document.createElement("span");
    const remBtn = document.createElement("button");
    const body = document.createElement("p");

    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    remBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");
    body.classList.add("mt-2", "w-100");

    remBtn.textContent = "Delete Task";

    title.style.fontWeight = "bold";

    li.appendChild(title);
    li.appendChild(remBtn);
    li.appendChild(body);

    title.textContent = el.title;
    body.textContent = el.title;

    li.dataset.id = el._id;

    return li;
  }

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
    localStorage.setItem("tasks", JSON.stringify(objOfTasks));
    console.log(objOfTasks);

    const item = generateListItems(formValues);
    listContainer.insertAdjacentElement("beforeend", item);

    const emptyObj = ObjIsEmpty(objOfTasks);
    showEmptyAlert(emptyObj);

    form.reset();
  }

  // Task Delete Handler
  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const targetParent = target.closest("[data-id]");
      const id = targetParent.dataset.id;
      const titleID = objOfTasks[id].title;
      const answer = confirm(`Delete task: ${titleID} ?`);

      if (!answer) return;
      targetParent.remove();

      delete objOfTasks[id];

      localStorage.setItem("tasks", JSON.stringify(objOfTasks));

      const emptyObj = ObjIsEmpty(objOfTasks);

      showEmptyAlert(emptyObj);
    }
  }

  // Checking an object for emptiness
  function ObjIsEmpty(objOfTasks) {
    for (key in objOfTasks) {
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
})(tasks);
