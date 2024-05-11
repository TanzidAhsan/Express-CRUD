const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'se'
});


connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


app.post('/user', (req, res) => {
    const { name, language, occupation, objective, subscription } = req.body;
    const newUser = {
        name,
        language,
        occupation,
        objective,
        subscription
    };
    connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
        if (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Error creating user' });
            return;
        }
        newUser.id = results.insertId;
        res.status(201).json(newUser);
    });
});


app.put('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, language, occupation, objective, subscription } = req.body;
    const updateUser = {
        name,
        language,
        occupation,
        objective,
        subscription
    };
    connection.query('UPDATE users SET ? WHERE id = ?', [updateUser, userId], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        updateUser.id = userId;
        res.status(200).json(updateUser);
    });
});


app.delete('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    connection.query('DELETE FROM users WHERE id = ?', userId, (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Error deleting user' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(204).end();
    });
});


app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            res.status(500).json({ error: 'Error retrieving users' });
            return;
        }
        res.json(results);
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
