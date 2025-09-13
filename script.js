document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress'); // ✅ corregido
    const progressNumbers = document.getElementById('numbers');

    // --- Mostrar / ocultar imagen de vacío ---
    const toggleEmptyImage = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    // --- Actualizar barra de progreso ---
    const updateProgressBar = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks === 0 ? '0%' : `${(completedTasks / totalTasks) * 100}%`;
        progressNumbers.textContent = totalTasks === 0 ? '0/0' : `${completedTasks}/${totalTasks}`;
    };

    // --- Guardar en localStorage ---
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // --- Añadir tarea ---
    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (taskText !== '') {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
                <span>${taskText}</span>
                <div class="task-buttons">
                    <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            const checkbox = li.querySelector('.checkbox');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            // --- Marcar completado ---
            if (completed) {
                li.classList.add('completed');
                editBtn.setAttribute('disabled', true);
                editBtn.style.opacity = 0.5;
                editBtn.style.pointerEvents = 'none';
            }

            checkbox.addEventListener('change', () => {
                const isChecked = checkbox.checked;
                li.classList.toggle('completed', isChecked);
                editBtn.disabled = isChecked;
                editBtn.style.opacity = isChecked ? 0.5 : 1;
                editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
                saveTasks();
                updateProgressBar();
            });

            // --- Editar tarea ---
            editBtn.addEventListener('click', () => {
                if (!checkbox.checked) {
                    taskInput.value = li.querySelector('span').textContent;
                    li.remove();
                    toggleEmptyImage();
                    saveTasks();
                    updateProgressBar();
                }
            });

            // --- Borrar tarea ---
            deleteBtn.addEventListener('click', () => {
                li.remove();
                toggleEmptyImage();
                saveTasks();
                updateProgressBar(); // ✅ agregado
            });

            taskList.appendChild(li);
            taskInput.value = '';
            toggleEmptyImage();
            saveTasks();
            updateProgressBar();
        }
    };

    // --- Cargar tareas guardadas ---
    const loadTasks = () => {
        const stored = JSON.parse(localStorage.getItem('tasks')) || [];
        stored.forEach(task => addTask(task.text, task.completed));
    };

    // --- Eventos ---
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    // --- Inicializar ---
    loadTasks();
    toggleEmptyImage();
    updateProgressBar();
});
