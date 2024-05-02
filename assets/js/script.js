const buttonEl = document.querySelector('#save-task');
const taskstoDoEl = document.querySelector('#tasks-to-do');

const createTaskHandler = function() {
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.textContent = "This is a new task.";
    taskstoDoEl.appendChild(listItemEl);
}

buttonEl.addEventListener('click', createTaskHandler);