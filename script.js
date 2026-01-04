let tasks = JSON.parse(localStorage.getItem('smartTodoTasks')) || [];
let alarmAudio = null;
let currentAlarmTask = null;

// Initialize audio
function initAlarm() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createBeep() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // oscillator.frequency.value = 1000;
        // oscillator.type = 'sine';

        oscillator.frequency.value = 440;
        oscillator.type = 'sawtooth';
        gainNode.gain.value = 1.0;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        return new Promise(resolve => {
            oscillator.onended = resolve;
        });
    }
    
    return createBeep;
}

function playAlarm() {
    const beep = initAlarm();
    let beepCount = 0; 
    const maxBeeps = 20; // Maximum number of beeps
    
    function playBeep() {
        if (beepCount < maxBeeps && currentAlarmTask) {
            beep().then(() => {
                beepCount++;
                if (beepCount < maxBeeps && currentAlarmTask) {
                    setTimeout(playBeep, 500);
                }
            });
        }
    }
    
    playBeep();
}

function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const dateTime = document.getElementById('taskDateTime').value;
    
    if (!title || !dateTime) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    const taskDate = new Date(dateTime);
    const now = new Date();
    
    if (taskDate <= now) {
        showNotification('Please select a future date and time!', 'error');
        return;
    }
    
    const task = {
        id: Date.now(),
        title: title,
        dateTime: dateTime,
        timestamp: taskDate.getTime(),
        notified: false,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    // Clear form
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDateTime').value = '';
    
    showNotification('Task added successfully! 🎉');
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    showNotification('Task deleted!');
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No tasks yet. Add your first task above!</p>
            </div>
        `;
        return;
    }
    
    // Sort tasks by date (nearest first)
    const sortedTasks = [...tasks].sort((a, b) => a.timestamp - b.timestamp);
    
    const now = new Date();
    
    tasksList.innerHTML = sortedTasks.map(task => {
        const taskDate = new Date(task.dateTime);
        const timeUntil = taskDate - now;
        const isUrgent = timeUntil <= 30 * 60 * 1000 && timeUntil > 0; // 30 minutes or less
        
        let countdownText = '';
        if (timeUntil > 0) {
            const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) {
                countdownText = `In ${days}d ${hours}h`;
            } else if (hours > 0) {
                countdownText = `In ${hours}h ${minutes}m`;
            } else {
                countdownText = `In ${minutes}m`;
            }
        } else {
            countdownText = 'Overdue';
        }
        
        return `
            <div class="task-item ${isUrgent ? 'urgent' : ''}" style="animation-delay: ${tasks.indexOf(task) * 0.1}s">
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-time">${formatDateTime(taskDate)}</div>
                    <div class="task-countdown">${countdownText}</div>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
    }).join('');
}

function formatDateTime(date) {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const content = document.getElementById('notificationContent');
    
    content.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showAlarm(task) {
    currentAlarmTask = task;
    document.getElementById('alarmTaskTitle').textContent = task.title;
    document.getElementById('alarmModal').style.display = 'flex';
    playAlarm();
    
    // Mark as notified
    task.notified = true;
    saveTasks();
}

function snoozeAlarm() {
    if (currentAlarmTask) {
        // Add 5 minutes to the task
        const newTime = new Date(currentAlarmTask.timestamp + 5 * 60 * 1000);
        currentAlarmTask.dateTime = newTime.toISOString().slice(0, -8);
        currentAlarmTask.timestamp = newTime.getTime();
        currentAlarmTask.notified = false;
        saveTasks();
        renderTasks();
    }
    dismissAlarm();
}

function dismissAlarm() {
    currentAlarmTask = null;
    document.getElementById('alarmModal').style.display = 'none';
}

function checkAlarms() {
    const now = new Date();
    
    tasks.forEach(task => {
        const taskTime = new Date(task.timestamp);
        const timeDiff = taskTime - now;
        
        // 5-minute warning notification
        if (timeDiff <= 5 * 60 * 1000 && timeDiff > 4 * 60 * 1000 && !task.notified) {
            showNotification(`⚠️ Reminder: "${task.title}" in 5 minutes!`);
            task.notified = true;
            saveTasks();
        }
        
        // Exact time alarm
        if (timeDiff <= 0 && timeDiff > -60 * 1000 && !task.alarmShown) {
            showAlarm(task);
            task.alarmShown = true;
            saveTasks();
        }
    });
}

function saveTasks() {
    localStorage.setItem('smartTodoTasks', JSON.stringify(tasks));
}

// Set minimum date to current date and time
function setMinDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('taskDateTime').min = minDateTime;
}

// Initialize
setMinDateTime();
renderTasks();

// Check for alarms every second
setInterval(checkAlarms, 1000);

// Update countdown every minute
setInterval(renderTasks, 60000);

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}