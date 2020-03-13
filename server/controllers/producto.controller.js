const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const getAllProductos = async (req, res) => {
  try {
    let page = 1;
    let itemsPerPage = 5;

    if (Number(req.query.page) && req.query.page) {
      page = req.query.page;
    }

    const opts = {
      page,
      limit: itemsPerPage,
      populate: {
        path: 'usuario categoria',
        select: '-__v'
      }
      // select: 'nombre email role estado google img'
    };

    const productos = await Producto.paginate({ disponible: true }, opts);

    if (!productos)
      return res.status(400).send({
        status: 400,
        message: 'No se han encontrado usuarios en la busqueda'
      });

    const data = {
      total: productos.totalDocs,
      currentPage: productos.page,
      totalPages: productos.totalPages,
      prevPage: productos.hasPrevPage,
      nextPage: productos.hasNextPage,
      productos: productos.docs
    };

    res.json({ ok: true, data: data });
  } catch (error) {
    res.status(500).send({
      status: 500,
      error: error.message
    });
  }
};

const createProducto = async (req, res) => {
  try {
    const id_user = req.user._id;

    const { nombre, precioUni, descripcion, disponible, categoria } = req.body;

    const cate = await Categoria.findById(categoria);

    if (!cate) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }

    if (typeof precioUni !== 'number') {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El precio debe ser un número'
        }
      });
    }

    const producto = new Producto({
      nombre,
      precioUni,
      descripcion,
      disponible,
      categoria,
      usuario: id_user
    });

    const productoDB = await producto.save();

    res.status(201).json({ ok: true, data: productoDB });
  } catch (error) {
    res.status(400).send({
      ok: false,
      error
    });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const producto = await Producto.findById(id)
      .populate('usuario', '-__v')
      .populate('categoria', '-__v');

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    res.json({ ok: true, data: producto });
  } catch (error) {
    res.status(500).send({
      status: 500,
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    producto.disponible = false;

    const productDB = await producto.save();

    res.json({ ok: true, data: productDB });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }
};

const updatePorduct = async (req, res) => {
  try {
    const id = req.params.id;

    const { nombre, precioUni, descripcion, categoria } = req.body;

    const categoriaDB = await Categoria.findById(categoria);

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'La categoria no existe'
        }
      });
    }

    const body = {
      nombre,
      precioUni,
      descripcion,
      categoria: categoriaDB._id
    };

    const producto = await Producto.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    res.json({ ok: true, data: producto });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const query = req.query.query;

    const regex = new RegExp(query, 'i');

    const producto = await Producto.find({ nombre: regex })
      .populate('usuario', '-__v')
      .populate('categoria', '-__v');

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    res.json({ ok: true, data: producto });
  } catch (error) {
    res.status(500).send({
      status: 500,
      error: error.message
    });
  }
};

module.exports = {
  getAllProductos,
  createProducto,
  getOneProduct,
  deleteProduct,
  updatePorduct,
  searchProduct
};
