const Categoria = require('../models/categoria');
const User = require('../models/usuario');

const listAllCategories = async (req, res) => {
  // const categorias = await Categoria.find({}).catch(error => {
  //   return res.status(400).json({
  //     ok: false,
  //     error
  //   });
  // });

  Categoria.find({})
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({ ok: true, categorias });
    });
};

const getOneCategoria = async (req, res) => {
  const { id } = req.params;

  // Categoria.findById(id, (err, categoriaDB) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   }

  //   if (!categoriaDB) {
  //     return res.status(500).json({
  //       ok: false,
  //       err: {
  //         message: 'El id no existe'
  //       }
  //     });
  //   }

  //   res.json({ ok: true, categoriaDB });
  // });

  try {
    // Excluir algunas propiedases
    const categoria = await Categoria.findById(id, '-__v').populate(
      'usuario',
      '-__v'
    );

    if (!categoria) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }

    res.json({ ok: true, categoria });
  } catch (error) {
    res.status(400).send({
      ok: false,
      error
    });
  }
};

const createCategory = async (req, res) => {
  const id_user = req.user._id;
  const { descripcion } = req.body;
  const categoria = new Categoria({
    descripcion,
    usuario: id_user
  });

  try {
    const categoriaDB = await categoria.save();
    return res.json({ ok: true, categoria: categoriaDB });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }
};

const updateCategory = async (req, res) => {
  const { descripcion, usuario } = req.body;

  const id_category = req.params.id;

  // si tambien actualizaremos el id del usuario que creo esta categoria
  // primero lo validaremos

  if (usuario) {
    try {
      const user = await User.findById(usuario);

      const user_id = await user._id;

      const categoryUpdated = await Categoria.findByIdAndUpdate(
        id_category,
        { descripcion, usuario: user_id },
        { new: true, runValidators: true, context: 'query' }
      );

      res.json({ ok: true, categoryUpdated });
    } catch (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
  } else {
    const categoryUpdated = await Categoria.findByIdAndUpdate(
      id_category,
      { descripcion },
      { new: true, runValidators: true, context: 'query' }
    );

    res.json({ ok: true, categoryUpdated });
  }
};

const deleteCategory = async (req, res) => {
  const id_category = req.params.id;

  try {
    await Categoria.findByIdAndRemove(id_category);
    res.json({ ok: true, message: 'Categoria eliminada' });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      err
    });
  }
};

module.exports = {
  listAllCategories,
  getOneCategoria,
  createCategory,
  updateCategory,
  deleteCategory
};
