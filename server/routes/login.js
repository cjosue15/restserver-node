const express = require('express');
const app = express();
const { logInAuth, googleAuth } = require('../controllers/login.controller');

app.post('/login', logInAuth);
app.post('/google', googleAuth);

module.exports = app;
