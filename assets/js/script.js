var taskIdCounter = 0;

const pageContentEl = document.querySelector('#page-content');
const formEl = document.querySelector('#task-form');

const taskstoDoEl = document.querySelector('#tasks-to-do');
const tasksInProgressEl = document.querySelector('#tasks-in-progress');
const tasksCompletedEl = document.querySelector('#tasks-completed');

const taskFormHandler = function(e) {
    e.preventDefault();

    const taskNameInput = document.querySelector("input[name='task-name']").value;
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    if(!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    formEl.reset();

    const isEdit = formEl.hasAttribute('data-task-id');

    //editing task
    if(isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //saving new task
    else {
        const taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        
        createTaskEl(taskDataObj);
    }
};

const createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    //add task id as a custom attribute
    listItemEl.setAttribute('data-task-id', taskIdCounter);
    //add draggable attribute
    listItemEl.setAttribute('draggable', 'true');

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
    var statusChoices = ['To Do', 'In Progress', 'Completed',];
    for (var i = 0; i < statusChoices.length; i++) {
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
    const targetEl = e.target;

    //edit button
    if(targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    }

    //delete button
    if(targetEl.matches('.delete-btn')) {
        //get the element's task id
        var taskId = e.target.getAttribute('data-task-id');
        deleteTask(taskId);
    };
};

const deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

const editTask = function(taskId) {
    //get the task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    const taskName = taskSelected.querySelector('h3.task-name').textContent;
    const taskType = taskSelected.querySelector('span.task-type').textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector('#save-task').textContent = "Save Task";

    formEl.setAttribute('data-task-id', taskId);
};

const completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    //reset form
    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = 'Add Task';

    alert('Task Updated!');
};

var taskStatusChangeHandler = function(e) {
    //get the task item's id
    var taskId = e.target.getAttribute('data-task-id');
    //get the currently selected option's value and convert to lowercase
    var statusValue = e.target.value.toLowerCase();
    //find the parent taks item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if(statusValue === 'to do') {
        taskstoDoEl.appendChild(taskSelected);
    } else if (statusValue ==='in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    };
};

const dragTaskHandler = function(e) {
    var taskId = e.target.getAttribute('data-task-id');
    e.dataTransfer.setData('text/plain', taskId);
};

const dropZoneDragHandler = function(e) {
    var taskListEl = e.target.closest('.task-list');
    if(taskListEl) {
        e.preventDefault();
        taskListEl.setAttribute('style', 'background: rgba(68, 233, 255, 0.7); border-style: dashed;');

    }
};

const dropTaskHandler = function(e) {
    var id = e.dataTransfer.getData('text/plain');
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = e.target.closest('.task-list');
    var statusType = dropZoneEl.id;
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if(statusType === 'tasks-to-do') {
        statusSelectEl.selectedIndex = 0;
    } else if(statusType === 'tasks-in-progress') {
        statusSelectEl.selectedIndex = 1;
    } else if(statusType === 'tasks-completed') {
        statusSelectEl.selectedIndex = 2;
    };

    dropZoneEl.removeAttribute('style');
    dropZoneEl.appendChild(draggableElement);
};

const dragLeaveHandler = function(e) {
    var taskListEl = e.target.closest('.task-list');
    if(taskListEl) {
        taskListEl.removeAttribute('style');
    }
}

formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
pageContentEl.addEventListener('dragstart', dragTaskHandler);
pageContentEl.addEventListener('dragover', dropZoneDragHandler);
pageContentEl.addEventListener('dragleave', dragLeaveHandler);
pageContentEl.addEventListener('drop', dropTaskHandler);
