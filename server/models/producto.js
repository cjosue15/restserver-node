const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const mongoosePagination = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  precioUni: {
    type: Number,
    required: [true, 'El precio únitario es necesario']
  },
  img: {
    type: String
  },
  descripcion: { type: String },
  disponible: { type: Boolean, default: true },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

ProductoSchema.plugin(mongoosePagination);

ProductoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Producto', ProductoSchema);
