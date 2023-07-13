const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE_PATH = 'users.json';

// GET /users
app.get('/users', (req, res) => {
const users = getUsersFromDB();
res.json(users);
});

// POST /users
app.post('/users', (req, res) => {
const users = getUsersFromDB();
const newUser = { ...req.body, id: generateUserId() };
users.push(newUser);
saveUsersToDB(users);
res.status(201).json(newUser);
});

// GET /users/:user_id
app.get('/users/:user_id', (req, res) => {
const users = getUsersFromDB();
const user = users.find((u) => u.id === parseInt(req.params.user_id));
if (user) {
res.json(user);
} else {
res.sendStatus(404);
}
});

// PUT /users/:user_id
app.put('/users/:user_id', (req, res) => {
const users = getUsersFromDB();
const userIndex = users.findIndex((u) => u.id === parseInt(req.params.user_id));
if (userIndex !== -1) {
users[userIndex] = { ...req.body, id: parseInt(req.params.user_id) };
saveUsersToDB(users);
res.sendStatus(200);
} else {
res.sendStatus(404);
}
});

// DELETE /users/:user_id
app.delete('/users/:user_id', (req, res) => {
const users = getUsersFromDB();
const userIndex = users.findIndex((u) => u.id === parseInt(req.params.user_id));
if (userIndex !== -1) {
users.splice(userIndex, 1);
saveUsersToDB(users);
res.sendStatus(204);
} else {
res.sendStatus(404);
}
});

// Helper functions

function getUsersFromDB() {
const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
return JSON.parse(data);
}

function saveUsersToDB(users) {
fs.writeFileSync(DB_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
}

function generateUserId() {
// Generate a unique ID here (e.g., using a library like uuid)
// For simplicity, let's use a random number between 1 and 1000 as the ID
return Math.floor(Math.random() * 1000) + 1;
}

app.listen(3000, () => {
console.log('Backend server is running on port 3000');
});
module.exports = app;
