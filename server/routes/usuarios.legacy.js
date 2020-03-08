const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/usuario');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/usuarios', (req, res) => {
  // parametros opcionales si viene sabremos desde que pagina queire si no desde la primera o los priemerps registros

  const desde = Number(req.query.desde) || 0;

  User.find({})
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({ ok: true, count: usuarios.length, usuarios });
    });
});

app.post('/usuario', async (req, res) => {
  const { nombre, email, password, role } = req.body;

  const user = new User({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  });

  // usando callbacks

  user.save((err, userBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({ ok: true, userBD });
  });

  // Usando promises

  // user
  //   .save()
  //   .then(userBD => {
  //     res.json({ ok: true, userBD });
  //   })
  //   .catch(err => {
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   });

  // Usando async - awaint, recordar se debe poner async en la funcion

  // try {
  //   const userDB = await user.save();
  //   return res.json({ ok: true, userBD: userDB });
  // } catch (error) {
  //   return res.status(400).json({
  //     ok: false,
  //     error
  //   });
  // }
});

app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;
  // const body = req.body;
  // Esto para evitar quitar lo que no deseamos que se actualize del body
  // se puede hacer de esta forma pero quizas tengamos colecciones mas grandes y por eso usaremos underscore
  // delete body.password
  // delete body.google

  // si se pueden actualizar
  const permitidos = ['nombre', 'email', 'img', 'role', 'estado'];

  const body = _.pick(req.body, permitidos);

  // Esto si esque quiero actualizar la contraseña y que sea hasheada

  // const body = req.body;
  // let newBody = {
  //   ...body,
  //   password: bcrypt.hashSync(body.password, 10)
  // };

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: 'query' },
    (err, userBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        userBD
      });
    }
  );
});

app.delete('/usuarios', (req, res) => {
  res.json({ text: 'delete usuarios' });
});

// module.exports = { users: app };
// module.exports = app;
