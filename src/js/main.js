class TaskTracker {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.form = document.getElementById('todoForm');
        this.input = document.getElementById('todoInput');
        this.dateInput = document.getElementById('todoDate');
        this.taskList = document.getElementById('todoList');
        this.taskCounter = document.getElementById('taskCounter');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const task = this.input.value.trim();
        const date = this.dateInput.value;

        if (!this.validateInput(task, date)) return;

        this.addTask(task, date);
        this.form.reset();
        this.updateDisplay();
    }

    validateInput(task, date) {
        if (!task || !date) {
            alert('Please fill in both task and date fields');
            return false;
        }
        if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
            alert('Please select a future date');
            return false;
        }
        return true;
    }

    addTask(text, dueDate) {
        const task = {
            id: Date.now(),
            text,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(task);
        this.saveTasks();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.updateDisplay();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.updateDisplay();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.updateDisplay();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    updateDisplay() {
        const filteredTasks = this.getFilteredTasks();
        const pendingCount = this.tasks.filter(task => !task.completed).length;
        
        this.taskCounter.textContent = `Stay organized and focused. You have ${pendingCount} pending tasks.`;
        
        this.taskList.innerHTML = filteredTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(task => this.createTaskElement(task))
            .join('');
    }

    createTaskElement(task) {
        return `
            <div class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onclick="taskTracker.toggleTask(${task.id})"
                       class="todo-checkbox">
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
                <span class="date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                <button onclick="taskTracker.deleteTask(${task.id})" class="delete-btn">
                    Delete
                </button>
            </div>
        `;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the task tracker
window.taskTracker = new TaskTracker();
