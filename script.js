function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let taskList = document.getElementById("taskList");

    // Check if the task already exists (case-insensitive)
    let existingTasks = taskList.querySelectorAll("span");
    for (let task of existingTasks) {
        if (task.textContent.trim().toLowerCase() === taskText.toLowerCase()) {
            alert("Task already exists!");
            return;
        }
    }

    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";
    checkbox.onclick = function() {
        li.classList.toggle("completed");
        updateTasksCookie();
    };

    let span = document.createElement("span");
    span.textContent = taskText;

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "❌";
    // Removed confirmation for deleting a single item:
    deleteBtn.onclick = function() {
        taskList.removeChild(li);
        updateTasksCookie();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    taskInput.value = "";
    updateTasksCookie();
}

function clearList() {
    let taskList = document.getElementById("taskList");
    if (confirm("Are you sure you want to clear all tasks?")) {
        taskList.innerHTML = "";
        updateTasksCookie();
    }
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function updateTasksCookie() {
    let tasks = [];
    let items = document.querySelectorAll("#taskList li");
    items.forEach(li => {
        let taskText = li.querySelector("span").textContent;
        let completed = li.classList.contains("completed");
        tasks.push({ text: taskText, completed: completed });
    });
    setCookie("tasks", JSON.stringify(tasks), 30); // stored for 30 days
}

function loadTasksFromCookie() {
    let cookie = getCookie("tasks");
    if (!cookie) return;
    try {
        let tasks = JSON.parse(cookie);
        tasks.forEach(task => {
            // Create list item
            let li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            if (task.completed) {
                li.classList.add("completed");
            }
    
            // Checkbox for completion
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "form-check-input me-2";
            checkbox.checked = task.completed;
            checkbox.onclick = function() {
                li.classList.toggle("completed");
                updateTasksCookie();
            };
    
            // Task text
            let span = document.createElement("span");
            span.textContent = task.text;
    
            // Delete button
            let deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-danger btn-sm";
            deleteBtn.textContent = "❌";
            deleteBtn.onclick = function() {
                if (confirm("Are you sure you want to delete this task?")) {
                    let taskList = document.getElementById("taskList");
                    taskList.removeChild(li);
                    updateTasksCookie();
                }
            };
    
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            document.getElementById("taskList").appendChild(li);
        });
    } catch (e) {
        console.error("Error parsing tasks from cookie", e);
    }
}

window.onload = function() {
    loadTasksFromCookie();
};
