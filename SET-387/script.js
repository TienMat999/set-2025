document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    
    let tasks = [];

    const renderTask = (task) => {
        const li = document.createElement('li');
        li.classList.add('todo-app__task-item');
        li.dataset.id = task.id;
        if (task.completed) {
            li.classList.add('todo-app__task-item--completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('todo-app__task-text');
        taskTextSpan.textContent = task.text;
        taskTextSpan.addEventListener('click', () => toggleTaskCompletion(task.id));

        const taskTextInput = document.createElement('input');
        taskTextInput.type = 'text';
        taskTextInput.classList.add('todo-app__edit-input');
        taskTextInput.style.display = 'none';
        taskTextInput.value = task.text;

        taskTextSpan.addEventListener('dblclick', () => {
            taskTextSpan.style.display = 'none';
            taskTextInput.style.display = 'inline-block';
            taskTextInput.focus();
        });

        taskTextInput.addEventListener('blur', () => {
            updateTaskText(task.id, taskTextInput.value);
            taskTextSpan.style.display = 'inline-block';
            taskTextInput.style.display = 'none';
        });

        taskTextInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                taskTextInput.blur();
            }
        });

        const editBtn = document.createElement('button');
        editBtn.classList.add('todo-app__button', 'todo-app__button--edit');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            taskTextSpan.style.display = 'none';
            taskTextInput.style.display = 'inline-block';
            taskTextInput.focus();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('todo-app__button', 'todo-app__button--delete');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(taskTextSpan);
        li.appendChild(taskTextInput);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        li.classList.add('todo-app__task-item--enter');
        taskList.appendChild(li);
        setTimeout(() => {
            li.classList.remove('todo-app__task-item--enter');
        }, 10);

        return li;
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Task cannot be empty!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        renderTask(newTask);
        taskInput.value = '';
        taskInput.focus();
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    };
    
    const updateTaskText = (id, newText) => {
        const task = tasks.find(t => t.id === id);
        if (task && newText.trim() !== '') {
            task.text = newText.trim();
            renderTasks();
        } else if (task && newText.trim() === '') {
            renderTasks();
        }
    };

    const toggleTaskCompletion = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            const li = taskList.querySelector(`.todo-app__task-item[data-id='${id}']`);
            if (li) {
                li.classList.toggle('todo-app__task-item--completed');
            }
        }
    };

    const deleteTask = (id) => {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            const li = taskList.querySelector(`.todo-app__task-item[data-id='${id}']`);
            if (li) {
                li.classList.add('todo-app__task-item--exit');
                li.addEventListener('transitionend', () => {
                    li.remove();
                });
            }
        }
    };

    const clearCompletedTasks = () => {
        const completedTasks = tasks.filter(task => task.completed);
        if (completedTasks.length === 0) {
            alert('No completed tasks to clear.');
            return;
        }
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    renderTasks();
});