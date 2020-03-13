const express = require('express');
const app = express();

const { verificatToken } = require('../middlewares/auth');

const {
  getAllProductos,
  createProducto,
  getOneProduct,
  deleteProduct,
  updatePorduct,
  searchProduct
} = require('../controllers/producto.controller');

// OBTENER TODOS LOS PRODUCTOS
app.get('/productos', verificatToken, getAllProductos);
//populate usuario ctegoria
//paginate

app.get('/producto/:id', verificatToken, getOneProduct);

app.post('/producto', verificatToken, createProducto);
// grabar el usuario
// grabar una categoria del listado

app.put('/producto/:id', verificatToken, updatePorduct);

app.delete('/producto/:id', verificatToken, deleteProduct);
// cambiar el estado disponible

// Busscar productos
app.get('/productos/buscar', verificatToken, searchProduct);

module.exports = app;
