// ============================================================
// Todo App - Lógica principal
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos principales del DOM ---
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    // ============================================================
    // Función: Mostrar u ocultar la imagen de "sin tareas"
    // ============================================================
    const toggleEmptyImage = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    // ============================================================
    // Función: Actualizar barra y números de progreso
    // ============================================================
    const updateProgressBar = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks === 0 ? '0%' : `${(completedTasks / totalTasks) * 100}%`;
        progressNumbers.textContent = totalTasks === 0 ? '0/0' : `${completedTasks}/${totalTasks}`;
    };

    // ============================================================
    // Función: Guardar tareas en localStorage
    // ============================================================
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

    // ============================================================
    // Función: Añadir una nueva tarea a la lista
    // ============================================================
    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (taskText !== '') {
            // Crear elemento de tarea
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
                <span>${taskText}</span>
                <div class="task-buttons">
                    <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            // Elementos internos de la tarea
            const checkbox = li.querySelector('.checkbox');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            // --- Marcar como completada si corresponde ---
            if (completed) {
                li.classList.add('completed');
                editBtn.setAttribute('disabled', true);
                editBtn.style.opacity = 0.5;
                editBtn.style.pointerEvents = 'none';
            }

            // --- Evento: Marcar tarea como completada ---
            checkbox.addEventListener('change', () => {
                const isChecked = checkbox.checked;
                li.classList.toggle('completed', isChecked);
                editBtn.disabled = isChecked;
                editBtn.style.opacity = isChecked ? 0.5 : 1;
                editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
                saveTasks();
                updateProgressBar();
            });

            // --- Evento: Editar tarea ---
            editBtn.addEventListener('click', () => {
                if (!checkbox.checked) {
                    taskInput.value = li.querySelector('span').textContent;
                    li.remove();
                    toggleEmptyImage();
                    saveTasks();
                    updateProgressBar();
                }
            });

            // --- Evento: Eliminar tarea ---
            deleteBtn.addEventListener('click', () => {
                li.remove();
                toggleEmptyImage();
                saveTasks();
                updateProgressBar();
            });

            // --- Agregar tarea al DOM y actualizar estado ---
            taskList.appendChild(li);
            taskInput.value = '';
            toggleEmptyImage();
            saveTasks();
            updateProgressBar();
        }
    };

    // ============================================================
    // Función: Cargar tareas guardadas desde localStorage
    // ============================================================
    const loadTasks = () => {
        const stored = JSON.parse(localStorage.getItem('tasks')) || [];
        stored.forEach(task => addTask(task.text, task.completed));
    };

    // ============================================================
    // Eventos principales de la aplicación
    // ============================================================

    // Evento: Botón para agregar tarea
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    // Evento: Agregar tarea con Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    // ============================================================
    // Inicialización de la aplicación
    // ============================================================
    loadTasks();
    toggleEmptyImage();
    updateProgressBar();
});
