const formEl = document.querySelector('#task-form');
const taskstoDoEl = document.querySelector('#tasks-to-do');

const createTaskHandler = function(e) {
    e.preventDefault();

    const taskNameInput = document.querySelector("input[name='task-name']").value;
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    //create list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML ="<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskstoDoEl.append(listItemEl);
}

formEl.addEventListener('submit', createTaskHandler);