const express = require('express');

const { verificatToken, verificaRol } = require('../middlewares/auth');

const {
  listAllCategories,
  createCategory,
  getOneCategoria,
  updateCategory,
  deleteCategory
} = require('../controllers/categoria.controller');

const app = express();

app.get('/categorias', verificatToken, listAllCategories);

app.get('/categoria/:id', verificatToken, getOneCategoria);

// Solo admministradores logueados y verificados pueden generar una categoria nueva

app.post('/categoria', [verificatToken, verificaRol], createCategory);

app.put('/categoria/:id', [verificatToken, verificaRol], updateCategory);

app.delete('/categoria/:id', [verificatToken, verificaRol], deleteCategory);

module.exports = app;
