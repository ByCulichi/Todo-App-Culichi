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
    const progressMessage = document.getElementById('progress-message');
    
    // --- Elementos de gestión de listas ---
    const createListBtn = document.getElementById('create-list-btn');
    const listsContainer = document.querySelector('.lists-container');
    const currentListName = document.getElementById('current-list-name');
    const renameListBtn = document.getElementById('rename-list-btn');
    const deleteListBtn = document.getElementById('delete-list-btn');
    
    // --- Estado global de la aplicación ---
    let currentListId = 'default';
    let lists = {};
    
    // ============================================================
    // Funciones de gestión de listas
    // ============================================================
    
    // Función: Inicializar datos de listas
    const initializeLists = () => {
        const storedLists = JSON.parse(localStorage.getItem('todoLists')) || {};
        if (Object.keys(storedLists).length === 0) {
            // Crear lista por defecto si no existe
            lists = {
                default: {
                    id: 'default',
                    name: 'Tareas',
                    color: '#04fc57',
                    tasks: JSON.parse(localStorage.getItem('tasks')) || [] // Migrar tareas existentes
                }
            };
            localStorage.removeItem('tasks'); // Limpiar old format
        } else {
            lists = storedLists;
        }
        saveLists();
    };
    
    // Función: Guardar listas en localStorage
    const saveLists = () => {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    };
    
    // Función: Crear nueva lista
    const createNewList = () => {
        const colors = ['#04fc57', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#a8e6cf', '#ff8a80'];
        const usedColors = Object.values(lists).map(list => list.color);
        const availableColors = colors.filter(color => !usedColors.includes(color));
        const selectedColor = availableColors.length > 0 ? availableColors[0] : colors[Math.floor(Math.random() * colors.length)];
        
        const listName = prompt('¿Cómo quieres llamar a tu nueva lista?', 'Nueva Lista');
        if (listName && listName.trim()) {
            const newListId = 'list_' + Date.now();
            lists[newListId] = {
                id: newListId,
                name: listName.trim(),
                color: selectedColor,
                tasks: []
            };
            saveLists();
            renderLists();
            switchToList(newListId);
        }
    };
    
    // Función: Renderizar lista de listas en sidebar
    const renderLists = () => {
        listsContainer.innerHTML = '';
        Object.values(lists).forEach(list => {
            const listItem = document.createElement('div');
            listItem.className = `list-item ${list.id === currentListId ? 'active' : ''}`;
            listItem.dataset.listId = list.id;
            
            listItem.innerHTML = `
                <div class="list-color" style="background: ${list.color};"></div>
                <span class="list-name">${list.name}</span>
                <span class="list-count">${list.tasks.filter(task => !task.completed).length}</span>
            `;
            
            listItem.addEventListener('click', () => switchToList(list.id));
            listsContainer.appendChild(listItem);
        });
    };
    
    // Función: Cambiar a una lista específica
    const switchToList = (listId) => {
        if (lists[listId]) {
            currentListId = listId;
            currentListName.textContent = lists[currentListId].name;
            
            // Actualizar lista activa en sidebar
            document.querySelectorAll('.list-item').forEach(item => {
                item.classList.toggle('active', item.dataset.listId === listId);
            });
            
            // Mostrar/ocultar botón de eliminar (no se puede eliminar la lista por defecto)
            deleteListBtn.style.display = listId === 'default' ? 'none' : 'block';
            
            loadCurrentListTasks();
            toggleEmptyImage();
            updateProgressBar();
        }
    };
    
    // Función: Renombrar lista actual
    const renameCurrentList = () => {
        const newName = prompt('Nuevo nombre para la lista:', lists[currentListId].name);
        if (newName && newName.trim()) {
            lists[currentListId].name = newName.trim();
            saveLists();
            renderLists();
            currentListName.textContent = newName.trim();
        }
    };
    
    // Función: Eliminar lista actual
    const deleteCurrentList = () => {
        if (currentListId !== 'default') {
            const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar la lista "${lists[currentListId].name}"?`);
            if (confirmDelete) {
                delete lists[currentListId];
                saveLists();
                renderLists();
                switchToList('default'); // Cambiar a lista por defecto
            }
        }
    };

    // ============================================================
    // Función: Mostrar u ocultar la imagen de "sin tareas"
    // ============================================================
    const toggleEmptyImage = () => {
        const currentTasks = lists[currentListId]?.tasks || [];
        emptyImage.style.display = currentTasks.length === 0 ? 'block' : 'none';
        todosContainer.style.width = currentTasks.length > 0 ? '100%' : '50%';
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
    // Función: Actualizar barra de progreso dinámica y mensajes
    // ============================================================
    const updateProgressBar = () => {
        const currentTasks = lists[currentListId]?.tasks || [];
        const totalTasks = currentTasks.length;
        const completedTasks = currentTasks.filter(task => task.completed).length;

        // Calcular porcentaje de progreso
        const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        
        // Actualizar barra de progreso con animación suave
        progressBar.style.width = `${progressPercentage}%`;
        
        // Actualizar números de progreso
        progressNumbers.textContent = totalTasks === 0 ? '0/0' : `${completedTasks}/${totalTasks}`;
        
        // ============================================================
        // Lógica de mensajes dinámicos según el estado de las tareas
        // ============================================================
        if (totalTasks === 0) {
            // No hay tareas
            progressMessage.textContent = 'Add your first task!';
            progressMessage.style.color = '#fff';
        } else if (completedTasks === totalTasks) {
            // Todas las tareas completadas - Mensaje especial
            progressMessage.innerHTML = '¡Felicidades, completaste todas tus tareas! 🎉';
            progressMessage.style.color = '#04fc57';
            progressMessage.style.textShadow = '0 0 10px rgba(4, 252, 87, 0.5)';
            
            // Mostrar animación de confeti
            showCompletionAnimation();
        } else if (completedTasks === 0) {
            // No hay tareas completadas
            progressMessage.textContent = `Tienes ${totalTasks} tarea${totalTasks > 1 ? 's' : ''} pendiente${totalTasks > 1 ? 's' : ''}`;
            progressMessage.style.color = '#fff';
            progressMessage.style.textShadow = 'none';
        } else {
            // Progreso parcial
            const pendingTasks = totalTasks - completedTasks;
            progressMessage.textContent = `¡Vas bien! Te quedan ${pendingTasks} tarea${pendingTasks > 1 ? 's' : ''}`;
            progressMessage.style.color = '#fff';
            progressMessage.style.textShadow = 'none';
        }
        
        // Actualizar contadores en sidebar
        renderLists();
        
        // Guardar cambios
        saveLists();
    };

    // ============================================================
    // Función: Cargar tareas de la lista actual
    // ============================================================
    const loadCurrentListTasks = () => {
        taskList.innerHTML = ''; // Limpiar lista actual
        const currentTasks = lists[currentListId]?.tasks || [];
        currentTasks.forEach(task => addTaskToDOM(task.text, task.completed));
    };
    
    // ============================================================
    // Función: Guardar tareas de la lista actual
    // ============================================================
    const saveCurrentListTasks = () => {
        if (!lists[currentListId]) return;
        
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        lists[currentListId].tasks = tasks;
        saveLists();
    };

    // ============================================================
    // Función: Añadir una nueva tarea a la lista actual
    // ============================================================
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            // Agregar tarea a los datos
            if (!lists[currentListId]) return;
            
            lists[currentListId].tasks.push({
                text: taskText,
                completed: false
            });
            
            // Agregar tarea al DOM
            addTaskToDOM(taskText, false);
            
            // Limpiar input y actualizar estado
            taskInput.value = '';
            toggleEmptyImage();
            updateProgressBar();
        }
    };
    
    // ============================================================
    // Función: Añadir tarea al DOM (usada por addTask y loadCurrentListTasks)
    // ============================================================
    const addTaskToDOM = (text, completed = false) => {
        // Crear elemento de tarea
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
            <span>${text}</span>
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
            saveCurrentListTasks();
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
                        saveCurrentListTasks();
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
            saveCurrentListTasks();
            toggleEmptyImage();
            updateProgressBar();
        });

        // --- Agregar tarea al DOM ---
        taskList.appendChild(li);
    };

    // ============================================================
    // Eventos principales de la aplicación
    // ============================================================

    // Eventos de gestión de listas
    createListBtn.addEventListener('click', createNewList);
    renameListBtn.addEventListener('click', renameCurrentList);
    deleteListBtn.addEventListener('click', deleteCurrentList);

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
    initializeLists();
    renderLists();
    switchToList(currentListId);
});
