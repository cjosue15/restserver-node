const express = require('express');
const app = express();
const { logInAuth } = require('../controllers/login.controller');

app.post('/login', logInAuth);

module.exports = app;
