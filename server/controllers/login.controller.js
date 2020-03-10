const bcrypt = require('bcrypt');
const User = require('../models/usuario');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

    const decoded = jwt.verify(token, process.env.SEED);

    res.json({
      ok: true,
      usuario: user,
      token,
      created: decoded.iat,
      expires: decoded.exp
    });
  });
};

async function verifyTokenGoogle(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

const googleAuth = async (req, res) => {
  const token = req.body.token;

  const googleUser = await verifyTokenGoogle(token).catch(e => {
    return res.status(403).json({ ok: false, err, e });
  });

  User.findOne({ email: googleUser.email }, (err, userDB) => {
    if (err)
      return res.status(500).json({
        ok: false,
        error
      });

    // si el usuario existe pasadmos a la validacion si esta autenticado con google o no
    if (userDB) {
      // revisamos si el usuario que existe creo su cuenta de manera normal pero quiere loguearse
      // con el correo de google

      if (!userDB.google) {
        return res.status(400).json({
          ok: false,
          error: {
            message: 'Debe usar su autenticacion normal'
          }
        });
      } else {
        // Si el usuario si creo su cuenta por google se le debe renovar el token

        const token = jwt.sign(
          {
            user: userDB
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          user: userDB,
          token
        });
      }
    } else {
      // Si el usuario no exite en la base de datos lo crearemos

      const user = new User();
      user.nombre = googleUser.nombre;
      user.email = googleUser.email;
      user.img = googleUser.img;
      user.google = true;
      user.password = ':3';

      user.save((err, usuarioDB) => {
        if (err)
          return res.status(500).json({
            ok: false,
            error
          });

        const token = jwt.sign(
          {
            user: userDB
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          user: usuarioDB,
          token
        });
      });
    }
  });

  // console.log(googleUser);
};

module.exports = {
  logInAuth,
  googleAuth
};
