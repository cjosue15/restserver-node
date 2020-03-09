require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT;
// const { users } = require('./routes/usuarios');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES OF USER
// app.use(users);

// Configuracion global de rutas
app.use(require('./routes/index'));

// CONNECTION MONGO DB

mongoose.connect(
  process.env.urlDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  (err, res) => {
    if (err) throw err;

    console.log('DataBase Connect MongoDB');
  }
);
// .then(res => console.log('OK database'))
// .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server in port ${port}`);
});
