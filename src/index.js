import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  class Todo {
    constructor(title, description, dueDate, priority) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.status = false;
    }

    setRead() {
      this.status = true;
    }

    updateTodo(title, description, dueDate, priority, status) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.status = status;
    }
  }

  class Project {
    constructor(name) {
      this.name = name;
      this.todos = [];
    }

    addTodo(todo) {
      this.todos.push(todo);
    }

    deleteTodo(index) {
      this.todos.splice(index, 1);
    }
  }

  const ProjectManager = (() => {
    let projects = [];

    const saveToStorage = () => {
      localStorage.setItem("todoProjects", JSON.stringify(projects));
    };

    const loadFromStorage = () => {
      const data = localStorage.getItem("todoProjects");
      if (data) {
        const parsed = JSON.parse(data);
        projects = parsed.map((projData) => {
          const project = new Project(projData.name);
          project.todos = projData.todos.map((todoData) => {
            const todo = new Todo(
              todoData.title,
              todoData.description,
              todoData.dueDate,
              todoData.priority
            );
            todo.status = todoData.status;
            return todo;
          });
          return project;
        });
      } else {
        projects = [];
        addProject("Default Project");
        addProject("Completed");
      }
    };

    const getProjects = () => projects;

    const addProject = (projectName) => {
      const newProject = new Project(projectName);
      projects.push(newProject);
      saveToStorage();
    };

    const getProject = (name) =>
      projects.find((project) => project.name === name);

    const saveChanges = () => {
      saveToStorage();
    };

    loadFromStorage();

    return { getProjects, addProject, getProject, saveChanges };
  })();

  const DOMController = (() => {
    const content = document.querySelector(".content");
    const tabHeading = document.createElement("div");
    tabHeading.classList.add("tab-heading");

    const dialog = document.querySelector(".create-todo");
    const closeButton = document.querySelectorAll("#close");
    const submit = document.querySelector(".submit-todo");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const dueDate = document.querySelector("#date");
    const projectListSelect = document.querySelector("#project-list");

    const projectTitleInput = document.querySelector("#project-title");
    const addProjectBtn = document.querySelector(".add-project-btn");
    const addProjectDialog = document.querySelector(".create-project");
    const submitProject = document.querySelector(".submit-project");

    const projectNav = document.querySelector(".todo-project-nav");

    addProjectBtn.addEventListener("click", () => {
      addProjectDialog.showModal();
    });

    closeButton.forEach((closeBtn) =>
      closeBtn.addEventListener("click", () => {
        dialog.close();
        addProjectDialog.close();
      })
    );

    const refreshProjectList = () => {
      projectListSelect.innerHTML = "";
      const projects = ProjectManager.getProjects();
      projects.forEach((project) => {
        if (project.name !== "Completed") {
          const option = document.createElement("option");
          option.value = project.name;
          option.textContent = project.name;
          projectListSelect.appendChild(option);
        }
      });
    };

    refreshProjectList();

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      const priorityInput = document.querySelector(
        'input[name="priority"]:checked'
      );
      const priority = priorityInput ? priorityInput.value : "Low";

      const isEditing = dialog.getAttribute("data-editing") === "true";

      if (isEditing) {
        const originalProjectName = dialog.getAttribute("data-project");
        const index = parseInt(dialog.getAttribute("data-index"));
        const originalProject = ProjectManager.getProject(originalProjectName);
        const todo = originalProject.todos[index];

        const newProjectName = projectListSelect.value;
        const newProject = ProjectManager.getProject(newProjectName);

     
        todo.updateTodo(
          title.value,
          description.value,
          dueDate.value,
          priority,
          todo.status
        );

        if (originalProjectName !== newProjectName) {
   
          originalProject.deleteTodo(index);
          newProject.addTodo(todo);
        }

        dialog.removeAttribute("data-editing");
        dialog.removeAttribute("data-project");
        dialog.removeAttribute("data-index");
      } else {
        const todo = new Todo(
          title.value,
          description.value,
          dueDate.value,
          priority
        );

        const project = ProjectManager.getProject(projectListSelect.value);
        project.addTodo(todo);
      }

      ProjectManager.saveChanges();

      pendingTab();

      dialog.close();
    });

    submitProject.addEventListener("click", (e) => {
      e.preventDefault();
      ProjectManager.addProject(projectTitleInput.value);
      refreshProjects();
      addProjectDialog.close();
    });

    const refreshProjects = () => {
      projectNav.innerHTML = "";
      const projects = ProjectManager.getProjects();
      projects.forEach((project) => {
        if (project.name !== "Completed") {
          const projectRow = document.createElement("div");
          projectRow.classList.add("todo-project-row");
          const projectTitle = document.createElement("h3");
          projectTitle.textContent = project.name;
          projectRow.appendChild(projectTitle);

          projectRow.addEventListener("click", () => {
            projectTab(project.name);
          });

          projectNav.appendChild(projectRow);
        }
      });
      refreshProjectList();
    };

    const projectTab = (projectName) => {
      content.innerHTML = "";
      const project = ProjectManager.getProject(projectName);
      tabHeading.textContent = project.name;
      content.appendChild(tabHeading);

      const todosContainer = document.createElement("div");
      todosContainer.classList.add("todos-container");
      content.appendChild(todosContainer);

      project.todos.forEach((todo) => {
        const titleText = document.createElement("h1");
        const descriptionText = document.createElement("h2");
        const dueDateText = document.createElement("h3");
        const priorityText = document.createElement("h4");
        const isCompleteText = document.createElement("h5");
        const markCompleteBtn = document.createElement("button");
        const editButton = document.createElement("button");

        titleText.textContent = todo.title;
        descriptionText.textContent = todo.description;
        dueDateText.textContent = todo.dueDate;
        priorityText.textContent = todo.priority;
        isCompleteText.textContent = todo.status ? "Complete" : "Pending";
        markCompleteBtn.textContent = "Mark Complete";
        editButton.textContent = "Edit";

        const textDetails = document.createElement("div");
        textDetails.classList.add("todo-text-details");

        const utilityDetails = document.createElement("div");
        utilityDetails.classList.add("todo-utility-details");

        const todoContainer = document.createElement("div");
        todoContainer.classList.add("todo");

        todosContainer.appendChild(todoContainer);
        todoContainer.appendChild(textDetails);
        todoContainer.appendChild(utilityDetails);

        textDetails.appendChild(titleText);
        textDetails.appendChild(descriptionText);

        utilityDetails.appendChild(dueDateText);
        utilityDetails.appendChild(priorityText);
        utilityDetails.appendChild(isCompleteText);

        markCompleteBtn.addEventListener("click", () => {
          todo.status = true;
          const completedProject = ProjectManager.getProject("Completed");
          completedProject.addTodo(todo);
          const index = project.todos.indexOf(todo);
          project.deleteTodo(index);
          ProjectManager.saveChanges();
          refreshProjects();
          pendingTab();
        });

        editButton.addEventListener("click", () => {
          title.value = todo.title;
          description.value = todo.description;
          dueDate.value = todo.dueDate;

          const radios = document.querySelectorAll('input[name="priority"]');
          radios.forEach((radio) => {
            radio.checked = radio.value === todo.priority;
          });

          projectListSelect.value = projectName;

          dialog.showModal();

          dialog.setAttribute("data-editing", "true");
          dialog.setAttribute("data-project", projectName);
          dialog.setAttribute("data-index", project.todos.indexOf(todo));
        });

        utilityDetails.appendChild(markCompleteBtn);
        utilityDetails.appendChild(editButton);
      });
    };

    const pendingTab = () => {
      content.innerHTML = "";

      const addTodoBtn = document.createElement("div");
      addTodoBtn.classList.add("add-todo");

      const addTodoIcon = document.createElement("i");
      addTodoIcon.classList.add("fa-solid", "fa-plus");

      const addTodoText = document.createElement("h2");
      addTodoText.textContent = "Add New Task";

      const todosContainer = document.createElement("div");
      todosContainer.classList.add("todos-container");

      tabHeading.textContent = "Pending To-Dos";
      content.appendChild(tabHeading);
      content.appendChild(addTodoBtn);
      content.appendChild(todosContainer);
      addTodoBtn.appendChild(addTodoIcon);
      addTodoBtn.appendChild(addTodoText);

      addTodoBtn.addEventListener("click", () => {
        dialog.showModal();
      });

      const refreshPendingTodo = () => {
        const projects = ProjectManager.getProjects();
        todosContainer.innerHTML = "";

        projects.forEach((project) => {
          if (project.name === "Completed") return; // skip completed

          project.todos.forEach((todo) => {
            if (todo.status) return; // skip completed todos

            const titleText = document.createElement("h1");
            const descriptionText = document.createElement("h2");
            const dueDateText = document.createElement("h3");
            const priorityText = document.createElement("h4");
            const markCompleteBtn = document.createElement("button");
            const editButton = document.createElement("button");

            titleText.textContent = todo.title;
            descriptionText.textContent = todo.description;
            dueDateText.textContent = todo.dueDate;
            priorityText.textContent = todo.priority;

            markCompleteBtn.textContent = "Mark Complete";
            editButton.textContent = "Edit";

            const textDetails = document.createElement("div");
            textDetails.classList.add("todo-text-details");

            const utilityDetails = document.createElement("div");
            utilityDetails.classList.add("todo-utility-details");

            const todoContainer = document.createElement("div");
            todoContainer.classList.add("todo");

            todosContainer.appendChild(todoContainer);
            todoContainer.appendChild(textDetails);
            todoContainer.appendChild(utilityDetails);

            textDetails.appendChild(titleText);
            textDetails.appendChild(descriptionText);

            utilityDetails.appendChild(dueDateText);
            utilityDetails.appendChild(priorityText);

            utilityDetails.appendChild(markCompleteBtn);
            utilityDetails.appendChild(editButton);

            markCompleteBtn.addEventListener("click", () => {
              todo.status = true;

              // Add todo to Completed project
              let completedProject = ProjectManager.getProject("Completed");
              if (!completedProject) {
                ProjectManager.addProject("Completed");
                completedProject = ProjectManager.getProject("Completed");
              }
              completedProject.addTodo(todo);

              const index = project.todos.indexOf(todo);
              project.deleteTodo(index);

              ProjectManager.saveChanges();
              refreshProjects();
              pendingTab();
            });

            editButton.addEventListener("click", () => {
              title.value = todo.title;
              description.value = todo.description;
              dueDate.value = todo.dueDate;

              const radios = document.querySelectorAll(
                'input[name="priority"]'
              );
              radios.forEach((radio) => {
                radio.checked = radio.value === todo.priority;
              });

              projectListSelect.value = project.name;

              dialog.showModal();

              dialog.setAttribute("data-editing", "true");
              dialog.setAttribute("data-project", project.name);
              dialog.setAttribute("data-index", project.todos.indexOf(todo));
            });
          });
        });
      };

      refreshPendingTodo();
    };

    const completedTab = () => {
      content.innerHTML = "";

      tabHeading.textContent = "Completed To-Dos";
      content.appendChild(tabHeading);

      const todosContainer = document.createElement("div");
      todosContainer.classList.add("todos-container");
      content.appendChild(todosContainer);

      const projects = ProjectManager.getProjects();

      projects.forEach((project) => {
        if (project.name === "Completed") {
          project.todos.forEach((todo) => {
            const titleText = document.createElement("h1");
            const descriptionText = document.createElement("h2");
            const dueDateText = document.createElement("h3");
            const priorityText = document.createElement("h4");

            titleText.textContent = todo.title;
            descriptionText.textContent = todo.description;
            dueDateText.textContent = todo.dueDate;
            priorityText.textContent = todo.priority;

            const textDetails = document.createElement("div");
            textDetails.classList.add("todo-text-details");

            const utilityDetails = document.createElement("div");
            utilityDetails.classList.add("todo-utility-details");

            const todoContainer = document.createElement("div");
            todoContainer.classList.add("todo");

            todosContainer.appendChild(todoContainer);
            todoContainer.appendChild(textDetails);
            todoContainer.appendChild(utilityDetails);

            textDetails.appendChild(titleText);
            textDetails.appendChild(descriptionText);

            utilityDetails.appendChild(dueDateText);
            utilityDetails.appendChild(priorityText);
          });
        }
      });
    };

    // Add event listeners for your tabs
    const pendingTabBtn = document.getElementById("pending");
    const completedTabBtn = document.getElementById("completed");

    pendingTabBtn.addEventListener("click", () => {
      pendingTab();
    });

    completedTabBtn.addEventListener("click", () => {
      completedTab();
    });

    return { refreshProjects, pendingTab };
  })();

  DOMController.refreshProjects();
  DOMController.pendingTab();
});
