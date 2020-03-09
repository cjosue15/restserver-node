const express = require('express');
const app = express();
const {
  createUser,
  updateUser,
  listAllUsers,
  getOneuser,
  removeUserOfDb,
  updateStateOfUser
} = require('../controllers/usuario.controller');

const { verificatToken, verificaRol } = require('../middlewares/auth');

app.get('/', (req, res) => {
  res.json({ message: 'Api for users' });
});

// usando mongoose-pagination-v2

app.get('/usuarios', verificatToken, listAllUsers);

app.get('/usuario/:id', verificatToken, getOneuser);

app.post('/usuario', [verificatToken, verificaRol], createUser);

app.put('/usuario/:id', [verificatToken, verificaRol], updateUser);

// app.delete('/usuario/:id', removeUserOfDb);

app.delete('/usuario/:id', [verificatToken, verificaRol], updateStateOfUser);

module.exports = app;
