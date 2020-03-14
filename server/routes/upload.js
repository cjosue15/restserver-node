const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const User = require('../models/usuario');
const Producto = require('../models/producto');

// default options - recordar que es un midelware
// Esto convierte nuestros archivos o almacena todo esto en req.files
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      error: { message: 'No se ha seleccionado ningun archivo' }
    });
  }

  // validar tipos

  const tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos validos son ' + tiposValidos.join(', '),
        tipo_proveeido: tipo
      }
    });
  }

  // <input type="file" name="archivo" />

  const archivo = req.files.archivo;

  // obtener extension

  const nombreCortado = archivo.name.split('.');

  const extension = nombreCortado[nombreCortado.length - 1];

  //   const nombreArchivo = nombreCortado.splice(nombreCortado.length - 1, 1);

  // Extensiones permitidas

  const extValidas = ['png', 'jpg', 'gif', 'jpeg'];

  // con el index of buscamos si la extension se encuentra o no
  // recordemos si se encuentra devuelve la poscion pero si no devuelve -1

  if (extValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + extValidas.join(', ')
      }
    });
  }

  // cambiar nombre a archivo y hacerlo unico

  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //   archivo.mv(`./uploads/${nombreCortado[0]}.${extension}`, error => {
  //   archivo.mv(`./uploads/${tipo}/${archivo.name}`, error => {
  archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, error => {
    if (error)
      return res.status(500).json({
        ok: false,
        error,
        err: error.message
      });

    // Aquí tenemos la imagen y debemos cargarla

    // res.json({ ok: true, message: 'Imagen subida correctamente' });

    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo, tipo);
    } else {
      imagenProducto(id, res, nombreArchivo, tipo);
    }
  });
});

const imagenUsuario = async (id, res, nombreArchivo, tipo) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      borraArchivo(tipo, nombreArchivo);

      return res.status(400).json({
        ok: false,
        error: {
          message: 'Usuario no existe'
        }
      });
    }

    borraArchivo(tipo, user.img);

    user.img = nombreArchivo;

    const usuarioDB = await user.save();

    res.json({
      ok: true,
      usuario: usuarioDB,
      message: 'Imagen subida correctamente',
      img: nombreArchivo
    });
  } catch (error) {
    borraArchivo(tipo, nombreArchivo);
    return res.status(500).json({
      ok: false,
      error
    });
  }
};

const imagenProducto = async (id, res, nombreArchivo, tipo) => {
  try {
    const product = await Producto.findById(id);

    if (!product) {
      borraArchivo(tipo, nombreArchivo);

      return res.status(400).json({
        ok: false,
        error: {
          message: 'Producto no existe'
        }
      });
    }

    borraArchivo(tipo, product.img);

    product.img = nombreArchivo;

    const productDB = await product.save();

    res.json({
      ok: true,
      producto: productDB,
      message: 'Imagen subida correctamente',
      img: nombreArchivo
    });
  } catch (error) {
    borraArchivo(tipo, nombreArchivo);
    return res.status(500).json({
      ok: false,
      error
    });
  }
};

const borraArchivo = (tipo, nombreImagen) => {
  const pathUrlImg = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  console.log(pathUrlImg);

  if (fs.existsSync(pathUrlImg)) {
    fs.unlinkSync(pathUrlImg);
  }
};

module.exports = app;
