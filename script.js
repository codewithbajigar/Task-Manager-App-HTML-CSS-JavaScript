
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const editId = document.getElementById("editId");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks on GUI
function showTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        const card = document.createElement("article");
        card.className = "task-card";

        const heading = document.createElement("h3");
        heading.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.type = "button";

        editButton.addEventListener("click", function() {
            titleInput.value = task.title;
            descriptionInput.value = task.description;
            editId.value = task.id;

            submitBtn.textContent = "Update Task";
            cancelBtn.hidden = false;

            titleInput.focus();
            taskForm.scrollIntoView({ behavior: "smooth" });
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            if (confirm("Are you sure you want to delete this task?")) {
                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });

                saveTasks();
                resetForm();
                showTasks();
            }
        });

        actions.append(editButton, deleteButton);
        card.append(heading, description, actions);
        taskList.appendChild(card);
    });

    taskCount.textContent =
        tasks.length + (tasks.length === 1 ? " task" : " tasks");

    emptyMessage.hidden = tasks.length !== 0;
}

// Add or update a task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
        alert("Please enter both title and description.");
        return;
    }

    if (editId.value) {
        const task = tasks.find(function(item) {
            return item.id === editId.value;
        });

        if (task) {
            task.title = title;
            task.description = description;
        }
    } else {
        tasks.push({
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            title: title,
            description: description
        });
    }

    saveTasks();
    resetForm();
    showTasks();
});

// Reset form
function resetForm() {
    taskForm.reset();
    editId.value = "";
    submitBtn.textContent = "+ Add Task";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", resetForm);

// Display saved tasks when page opens
showTasks();
