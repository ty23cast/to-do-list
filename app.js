// To-Do List Application Frontend Logic
class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.currentTab = 'all';
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderTasks();
    this.updateStats();
    this.checkEmptyState();
  }

  bindEvents() {
    // Add task form submission
    document.getElementById('addTaskForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTask();
    });

    // Tab switching
    document.querySelectorAll('#taskTabs .nav-link').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTab(tab.id.replace('-tab', ''));
      });
    });
  }

  addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (!taskText) return;

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.checkEmptyState();

    input.value = '';
    input.focus();
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.checkEmptyState();
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('#taskTabs .nav-link').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('show', 'active');
    });
    document.getElementById(tabName).classList.add('show', 'active');

    this.renderTasks();
  }

  renderTasks() {
    const filteredTasks = this.getFilteredTasks();

    // Clear all task lists
    ['all', 'pending', 'completed'].forEach(tab => {
      document.getElementById(tab + 'TasksList').innerHTML = '';
    });

    if (filteredTasks.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();

    filteredTasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      const listId = this.currentTab === 'all' ? 'allTasksList' :
                    this.currentTab === 'pending' ? 'pendingTasksList' : 'completedTasksList';
      document.getElementById(listId).appendChild(taskElement);
    });
  }

  createTaskElement(task) {
    const li = document.createElement('div');
    li.className = 'list-group-item d-flex align-items-center task-item';
    if (task.completed) {
      li.classList.add('task-completed');
    }

    li.innerHTML = `
      <div class="custom-control custom-checkbox mr-3">
        <input type="checkbox" class="custom-control-input" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
        <label class="custom-control-label" for="task-${task.id}"></label>
      </div>
      <span class="task-text flex-grow-1">${this.escapeHtml(task.text)}</span>
      <div class="task-actions">
        <button class="btn btn-sm btn-outline-danger delete-btn" data-task-id="${task.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    // Bind events
    const checkbox = li.querySelector(`#task-${task.id}`);
    const deleteBtn = li.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => this.toggleTask(task.id));
    deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

    return li;
  }

  getFilteredTasks() {
    switch (this.currentTab) {
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  updateStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter(task => !task.completed).length;
    const completed = this.tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('completedTasks').textContent = completed;
  }

  checkEmptyState() {
    if (this.tasks.length === 0) {
      this.showEmptyState();
    } else {
      this.hideEmptyState();
    }
  }

  showEmptyState() {
    document.getElementById('emptyState').classList.remove('d-none');
  }

  hideEmptyState() {
    document.getElementById('emptyState').classList.add('d-none');
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});