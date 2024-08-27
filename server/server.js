const express = require('express');
const app = express();
app.use(express.json());
let todos = [];
app.get('/api/todos', (req, res) => {
    res.json(todos);
})

app.post('/api/todos', (req, res) => {
    const newTodos = req.body;
    todos = todos.concat(newTodos);
    res.status(201).json(newTodos);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});