
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('todolist.html')) {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        if (!cookies.isLoggedIn) {
            alert("Session expired login again");

            window.location.href = 'login.html';
        } else {
            loadTodos();
        }
    }
});


document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const expirationTime = new Date(Date.now() + 6000 * 1000); // 6000 seconds
        document.cookie = `isLoggedIn=true; path=/; expires=${expirationTime.toUTCString()}`;
        window.location.href = 'todolist.html';
    } else {
        alert('Invalid credentials!');
    }
});

// Signup Handler
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
    } else {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';
    }
});

function logout() {
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = 'login.html';
}

// To-Do List Functions
function addTodo() {
    const input = document.getElementById('todoInput');
    const timeInput = document.getElementById('todoTime');
    const task = input.value.trim();
    const completionTime = timeInput.value;

    if (!task || !completionTime) {
        alert('Please fill both task and time!');
        return;
    }

    const todos = JSON.parse(localStorage.getItem('todos') || []);
    todos.push({
        task,
        time: completionTime,
        added: new Date().toISOString() // Optional: track when task was added
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = '';
    timeInput.value = '';
    loadTodos();
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const list = document.getElementById('todoList');

    list.innerHTML = todos.map(todo => `
        <li>
            <div class="task-text">${todo.task}</div>
            <div class="task-time">
                Complete by: ${new Date(todo.time).toLocaleString()}
            </div>
        </li>
    `).join('');
}
