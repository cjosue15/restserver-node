const express = require('express');
const User = require('../models/usuario');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/usuarios', (req, res) => {
  res.json({ text: 'get usuarios' });
});

app.post('/usuario', (req, res) => {
  const { nombre, email, password, role } = req.body;

  const user = new User({
    nombre,
    email,
    password,
    role
  });

  user.save((err, userBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({ ok: true, userBD });
  });

  //   if (data.nombre === undefined) {
  //     res.status(400).json({
  //       ok: false,
  //       mensaje: 'El nombre es necesario'
  //     });
  //   } else {
  //     res.json(user);
  //   }
});

app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;

  console.log(id);
  res.json({ text: 'put usuarios' });
});

app.delete('/usuarios', (req, res) => {
  res.json({ text: 'delete usuarios' });
});

module.exports = { users: app };
module.exports = app;
