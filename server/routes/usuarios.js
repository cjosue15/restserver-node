const express = require('express');
const User = require('../models/usuario');
const app = express();
const {
  createUser,
  updateUser,
  listAllUsers,
  getOneuser,
  removeUserOfDb,
  updateStateOfUser
} = require('../controllers/usuario.controller');

app.get('/', (req, res) => {
  res.send('Hello World');
});

// usando mongoose-pagination-v2

app.get('/usuarios', listAllUsers);

app.get('/usuario/:id', getOneuser);

app.post('/usuario', createUser);

app.put('/usuario/:id', updateUser);

// app.delete('/usuario/:id', removeUserOfDb);

app.delete('/usuario/:id', updateStateOfUser);

module.exports = app;
