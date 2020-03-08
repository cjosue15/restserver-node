const User = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const createUser = async (req, res) => {
  const { nombre, email, password, role } = req.body;

  const user = new User({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  });

  try {
    const userDB = await user.save();
    return res.json({ ok: true, userBD: userDB });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  // Para permitir los que se pueden actualizar
  const permitidos = ['nombre', 'email', 'img', 'role', 'estado'];

  const body = _.pick(req.body, permitidos);

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

      return res.json({
        ok: true,
        userBD
      });
    }
  );
};

const listAllUsers = (req, res) => {
  let page = 1;
  let itemsPerPage = 5;

  if (Number(req.query.page) && req.query.page) {
    page = req.query.page;
  }

  const opts = {
    page,
    limit: itemsPerPage,
    select: 'nombre email role estado google img'
  };

  User.paginate({ estado: true }, opts, (err, users) => {
    if (err)
      return res.status(500).send({
        status: 500,
        message: 'Error del server'
      });

    if (!users)
      return res.status(400).send({
        status: 400,
        message: 'No se han encontrado usuarios en la busqueda'
      });

    const data = {
      totalUsers: users.totalDocs,
      currentPage: users.page,
      totalPages: users.totalPages,
      prevPage: users.hasPrevPage,
      nextPage: users.hasNextPage,
      users: users.docs
    };

    res.json({ ok: true, data: data });
  });
};

const getOneuser = async (req, res) => {
  const { id } = req.params;

  try {
    // Excluir algunas propiedases
    const user = await User.findById(id, '-password -__v');
    res.json({ ok: true, data: user });
  } catch (error) {
    res.status(400).send({
      ok: false,
      error
    });
  }
};

const removeUserOfDb = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndRemove(id);

    if (!user) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    // Podemos como no podemos enviar el usuario eliminado

    return res.json({ ok: true, message: 'Usuario eliminado', user });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }
};

const updateStateOfUser = async (req, res) => {
  const { id } = req.params;

  const opts = {
    new: true,
    select: 'nombre email'
  };

  try {
    const user = await User.findByIdAndUpdate(id, { estado: false }, opts);

    if (!user) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Usuario no encontrado'
        }
      });
    }

    return res.json({ ok: true, message: 'Usuario eliminado', user });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  listAllUsers,
  getOneuser,
  removeUserOfDb,
  updateStateOfUser
};
