const formEl = document.querySelector('#task-form')
const taskstoDoEl = document.querySelector('#tasks-to-do');

const createTaskHandler = function(e) {
    e.preventDefault();

    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.textContent = "This is a new task.";
    taskstoDoEl.appendChild(listItemEl);
}

formEl.addEventListener('submit', createTaskHandler);