if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        this.navigator.serviceWorker.register('/sw.js').then(function (registeration) {
            console.log('Service Worker registered with scope:', registeration.scope);
        }).catch(function (error) {
            console.error('Service Worker registeration failed:', error)
        });
    });
}
let db;
const request = indexedDB.open('pwa-database', 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('todos', { KeyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false });
};
request.onsuccess = function (event) {
    db = event.target.result;
    loadTodos();
}
request.onerror = function (error) {
    console.error('IndexedDB error:', event.target.errorCode);
}

function addTodo(name) {
    const transaction = db.transaction(['todos'], 'readWrite');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.add({ name });
    request.onsuccess = function (event) {
        console.log('To-do item added:', event.target.result);
        loadTodos();
    }
}

function loadTodos() {
    const transaction = db.transaction(['todos'], 'readonly');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
        const todos = event.target.result;
        const todolist = document.getElementById('todo-list');
        todolist.innerHTML = '';
        todos.forEach(function (todo) {
            const li = document.createElement('li');
            li.textContent = todo.name;
            todolist.appendChild(li);
        });
    };
}

function syncWithServers() {
    const transaction = db.transaction(['todos'], 'readonly');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
        const todos = event.target.result;
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todos)
        }).then(response => response.json()).then(data => {
            console.log('Data synced with server:', data);
        });
    };
}

window.addEventListener('online', syncWithServers);


if ('Notification' in window && 'serverWorker' in navigator) {
    Notification.requestPermission(function (status) {
        console.log('Notification permission status:', status);
    });
}
navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register('sync-todos');
});