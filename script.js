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
    // Función: Mostrar animación de confeti cuando todas las tareas están completadas
    // ============================================================
    const showCompletionAnimation = () => {
        // Crear elementos de confeti
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Generar partículas de confeti
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)]};
                left: ${Math.random() * 100}vw;
                animation: confetti-fall 3s linear forwards;
                border-radius: 50%;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        
        // Remover la animación después de 3 segundos
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 3000);
    };

    // ============================================================
    // Función: Actualizar barra y números de progreso
    // ============================================================
    const updateProgressBar = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks === 0 ? '0%' : `${(completedTasks / totalTasks) * 100}%`;
        progressNumbers.textContent = totalTasks === 0 ? '0/0' : `${completedTasks}/${totalTasks}`;
        
        // Mostrar animación si todas las tareas están completadas
        if (totalTasks > 0 && completedTasks === totalTasks) {
            showCompletionAnimation();
        }
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
                    const taskSpan = li.querySelector('span');
                    const currentText = taskSpan.textContent;
                    
                    // Crear input de edición
                    const editInput = document.createElement('input');
                    editInput.type = 'text';
                    editInput.value = currentText;
                    editInput.style.cssText = `
                        background: transparent;
                        border: 2px solid #04fc57;
                        border-radius: 15px;
                        color: white;
                        padding: 5px 10px;
                        flex: 1;
                        margin: 0 10px;
                        font-size: 1.2rem;
                        outline: none;
                    `;
                    
                    // Reemplazar el span con el input
                    taskSpan.replaceWith(editInput);
                    editInput.focus();
                    editInput.select();
                    
                    // Función para guardar cambios
                    const saveEdit = () => {
                        const newText = editInput.value.trim();
                        if (newText !== '' && editInput.parentNode) {
                            const newSpan = document.createElement('span');
                            newSpan.textContent = newText;
                            newSpan.style.cssText = 'flex: 1; margin: 0 10px; word-wrap: break-word;';
                            editInput.replaceWith(newSpan);
                            saveTasks();
                        } else if (editInput.parentNode) {
                            // Si el texto está vacío, restaurar el texto original
                            const newSpan = document.createElement('span');
                            newSpan.textContent = currentText;
                            newSpan.style.cssText = 'flex: 1; margin: 0 10px; word-wrap: break-word;';
                            editInput.replaceWith(newSpan);
                        }
                    };
                    
                    // Función para cancelar edición
                    const cancelEdit = () => {
                        if (editInput.parentNode) {
                            const newSpan = document.createElement('span');
                            newSpan.textContent = currentText;
                            newSpan.style.cssText = 'flex: 1; margin: 0 10px; word-wrap: break-word;';
                            editInput.replaceWith(newSpan);
                        }
                    };
                    
                    // Eventos para guardar o cancelar
                    let isHandled = false;
                    
                    editInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' && !isHandled) {
                            e.preventDefault();
                            isHandled = true;
                            saveEdit();
                        }
                    });
                    
                    editInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && !isHandled) {
                            e.preventDefault();
                            isHandled = true;
                            cancelEdit();
                        }
                    });
                    
                    editInput.addEventListener('blur', () => {
                        if (!isHandled) {
                            isHandled = true;
                            saveEdit();
                        }
                    });
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
