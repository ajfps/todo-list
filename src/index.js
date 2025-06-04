import { createElement } from "react";
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

    const getProjects = () => projects;

    const addProject = (projectName) => {
      const newProject = new Project(projectName);
      projects.push(newProject);
    };

    const getProject = (name) =>
      projects.find((project) => project.name === name);

    return { getProjects, addProject, getProject };
  })();

  ProjectManager.addProject("Default Project");
  ProjectManager.addProject("Completed");

  const DOMController = (() => {
    const content = document.querySelector(".content");
    const tabHeading = document.createElement("div");
    tabHeading.classList.add("tab-heading");

    const tabRefresher = () => {
      const pendingBtn = document.querySelector("#pending");
      const completedBtn = document.querySelector("#completed");

      pendingBtn.addEventListener("click", () => {
        pendingTab();
      });

      completedBtn.addEventListener("click", () => {
        completedTab();
      });
    };

    const dialog = document.querySelector(".create-todo");
    const closeButton = document.querySelectorAll("#close");
    const submit = document.querySelector(".submit-todo");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const dueDate = document.querySelector("#date");

    const projectTitle = document.querySelector("#project-title");
    const addProjectBtn = document.querySelector(".add-project-btn");
    const addProjectDialog = document.querySelector(".create-project");
    const submitProject = document.querySelector(".submit-project");

    addProjectBtn.addEventListener("click", () => {
      addProjectDialog.showModal();
    });

    closeButton.forEach((closeBtn) =>
      closeBtn.addEventListener("click", () => {
        dialog.close();
        addProjectDialog.close();
      })
    );

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      const priorityInput = document.querySelector(
        'input[name="priority"]:checked'
      );
      const priority = priorityInput ? priorityInput.value : "Low";

      const todo = new Todo(
        title.value,
        description.value,
        dueDate.value,
        priority
      );

      const project = ProjectManager.getProject("Default Project");
      project.addTodo(todo);

      pendingTab();

      dialog.close();
    });

    submitProject.addEventListener("click", (e) => {
      e.preventDefault();
      ProjectManager.addProject(projectTitle.value);
      refreshProjects();
      console.log(ProjectManager.getProjects());
    });

    const projectNav = document.querySelector(".todo-project-nav");

    const refreshProjects = () => {
      const projects = ProjectManager.getProjects();

      projects.forEach((project) => {
        if (
          project.name !== "Default Project" &&
          project.name !== "Completed"
        ) {
          const projectRow = document.createElement("div");
          projectRow.classList.add("todo-project-row");
          const projectTitle = document.createElement("h3");
          projectTitle.textContent = project.name;

          projectNav.appendChild(projectRow);
          projectRow.appendChild(projectTitle);

          projectRow.addEventListener("click", () => {
            projectTab(project.name);
          });
        }
      });
    };

    const projectTab = (projectName) => {
      content.innerHTML = "";
      tabHeading.textContent = project.name;

      const todosContainer = document.createElement("div");
      todosContainer.classList.add("todos-container");
      content.appendChild(todosContainer);

      todosContainer.innerHTML = "";

      const project = ProjectManager.getProject(projectName.name);
      
      project.todos.forEach((todo) => {
        const titleText = document.createElement("h1");
        const descriptionText = document.createElement("h2");
        const dueDateText = document.createElement("h3");
        const priorityText = document.createElement("h4");
        const isCompleteText = document.createElement("h5");
        const markCompleteBtn = document.createElement("button");

        titleText.textContent = todo.title;
        descriptionText.textContent = todo.description;
        dueDateText.textContent = todo.dueDate;
        priorityText.textContent = todo.priority;
        isCompleteText.textContent = todo.status ? "Complete" : "Pending";
        markCompleteBtn.textContent = "Mark Complete";

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
          refreshPendingTodo();
        });

        utilityDetails.appendChild(markCompleteBtn);
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
        const project = ProjectManager.getProject("Default Project");
        todosContainer.innerHTML = "";

        project.todos.forEach((todo) => {
          const titleText = document.createElement("h1");
          const descriptionText = document.createElement("h2");
          const dueDateText = document.createElement("h3");
          const priorityText = document.createElement("h4");
          const isCompleteText = document.createElement("h5");
          const markCompleteBtn = document.createElement("button");

          titleText.textContent = todo.title;
          descriptionText.textContent = todo.description;
          dueDateText.textContent = todo.dueDate;
          priorityText.textContent = todo.priority;
          isCompleteText.textContent = todo.status ? "Complete" : "Pending";
          markCompleteBtn.textContent = "Mark Complete";

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
            refreshPendingTodo();
          });

          utilityDetails.appendChild(markCompleteBtn);
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

      const refreshCompletedTodo = () => {
        const project = ProjectManager.getProject("Completed");
        todosContainer.innerHTML = "";

        project.todos.forEach((todo) => {
          const titleText = document.createElement("h1");
          const descriptionText = document.createElement("h2");
          const dueDateText = document.createElement("h3");
          const priorityText = document.createElement("h4");
          const isCompleteText = document.createElement("h5");
          const markCompleteBtn = document.createElement("button");

          titleText.textContent = todo.title;
          descriptionText.textContent = todo.description;
          dueDateText.textContent = todo.dueDate;
          priorityText.textContent = todo.priority;
          isCompleteText.textContent = todo.status ? "Complete" : "Pending";

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
          utilityDetails.appendChild(markCompleteBtn);
        });
      };

      refreshCompletedTodo();
    };

    return { pendingTab, tabRefresher, refreshProjects };
  })();

  DOMController.pendingTab();
  DOMController.refreshProjects();
  DOMController.tabRefresher();
});
