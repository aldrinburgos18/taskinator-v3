var taskIdCounter = 0;

const pageContentEl = document.querySelector('#page-content');
const formEl = document.querySelector('#task-form');
const taskstoDoEl = document.querySelector('#tasks-to-do');

const taskFormHandler = function(e) {
    e.preventDefault();

    const taskNameInput = document.querySelector("input[name='task-name']").value;
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    if(!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    formEl.reset();

    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj)
};

const createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    //add task id as a custom attribute
    listItemEl.setAttribute('data-task-id', taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML ="<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    taskstoDoEl.append(listItemEl);

    //increase task counter for next unique id
    taskIdCounter++;
};

const createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    //create edit button
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create select element
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className ='select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    //loop through select choices
    var statusChoices = ['To Do', 'In Progress', 'Completed'];
    for (var i=0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl)
    }


    return actionContainerEl;
};

const taskButtonHandler = function(e) {
    if(e.target.matches('.delete-btn')) {
        //get the element's task id
        var taskId = e.target.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

const deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);