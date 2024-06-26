var taskIdCounter = 0;
var tasks = [];

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
            type: taskTypeInput,
            status: "to do"
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

    //add id property to taskDataObj
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    //increase task counter for next unique id
    taskIdCounter++;

    //save to localStorage
    saveTasks();
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

    //create a new array to hold updated list of tasks
    var updatedTasksArr = [];

    //loop through current tasks and keep tasks that doesnt match id
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id !== parseInt(taskId)) {
            updatedTasksArr.push(tasks[i]);
        };
    };

    //reassign tasks array to be the same as updatedTasksArr
    tasks = updatedTasksArr;

    //save to localStorage
    saveTasks();
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

    //loop through tasks array and task object with new content
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        };
    };

    //reset form
    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = 'Add Task';

    alert('Task Updated!');

    //save to localStorage
    saveTasks();
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

    //update task's status in tasks array
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        };
    };

    //save to localStorage
    saveTasks();
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

    //update task's status in tasks array
    for(var i = 0; i < tasks.length; i++){
        if(tasks[i].id === parseInt(id)){
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    };

    //save to localStorage
    saveTasks();
};

const dragLeaveHandler = function(e) {
    var taskListEl = e.target.closest('.task-list');
    if(taskListEl) {
        taskListEl.removeAttribute('style');
    };
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
   var storedTasks = JSON.parse(localStorage.getItem('tasks'));

   if(!storedTasks) {
    return false;
   };

   tasks = storedTasks;

   for(var i = 0; i < tasks.length; i++) {
    //update taskIdCounter
    taskIdCounter = tasks[i].id;

    //create list item element
    var listItemEl = document.createElement('li');
    listItemEl.className = "task-item";
    listItemEl.setAttribute('data-task-id', tasks[i].id);
    listItemEl.setAttribute('draggable', true);

    //create div to hold task title and task type
    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    
    var taskActionsEl = createTaskActions(tasks[i].id);

    listItemEl.appendChild(taskInfoEl);
    listItemEl.appendChild(taskActionsEl);

    if(tasks[i].status === "to do") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
        taskstoDoEl.appendChild(listItemEl);
    } else if(tasks[i].status === "in progress") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.appendChild(listItemEl);
    } else if(tasks[i].status === "completed") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
        tasksCompletedEl.appendChild(listItemEl);
    };

    taskIdCounter++;
   }
}

formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
pageContentEl.addEventListener('dragstart', dragTaskHandler);
pageContentEl.addEventListener('dragover', dropZoneDragHandler);
pageContentEl.addEventListener('dragleave', dragLeaveHandler);
pageContentEl.addEventListener('drop', dropTaskHandler);
loadTasks();