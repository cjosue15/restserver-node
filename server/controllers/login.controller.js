const bcrypt = require('bcrypt');
const User = require('../models/usuario');
const jwt = require('jsonwebtoken');

const logInAuth = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (error, user) => {
    if (error)
      return res.status(400).json({
        ok: false,
        error
      });

    if (!user)
      return res.status(500).json({
        ok: false,
        error: {
          message: '(Email) o contraseña incorrecta'
        }
      });

    const passOk = bcrypt.compareSync(password, user.password);

    if (!passOk)
      return res.status(500).json({
        ok: false,
        error: {
          message: 'Email o (contraseña) incorrecta'
        }
      });

    // En el objeto va el payload, la info la que deseamos enviar

    const token = jwt.sign(
      {
        user: user
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({ ok: true, usuario: user, token });
  });
};

module.exports = {
  logInAuth
};
