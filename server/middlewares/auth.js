const jwt = require('jsonwebtoken');
// ===========================
// Verificacion
// ===========================

const verificatToken = (req, res, next) => {
  const token = req.get('token'); // Authorization

  const SEED = process.env.SEED;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err)
      return res.status(401).json({
        ok: false,
        err
      });

    req.user = decoded.user;

    next();
  });
};

// ===========================
// Verifica ADMIN_ROL
// ===========================

const verificaRol = (req, res, next) => {
  const user_role = req.user.role;

  if (user_role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      error: {
        message: 'El usuario no cuenta con permisos para crear otros usuarios'
      }
    });
  }
};

module.exports = {
  verificatToken,
  verificaRol
};
