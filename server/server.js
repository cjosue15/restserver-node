require('./config/config');

const express = require('express');

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/usuarios', (req, res) => {
  res.json({ text: 'get usuarios' });
});

app.post('/usuario', (req, res) => {
  const data = req.body;

  if (data.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario'
    });
  } else {
    res.json(data);
  }
});

app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;

  console.log(id);
  res.json({ text: 'put usuarios' });
});

app.delete('/usuarios', (req, res) => {
  res.json({ text: 'delete usuarios' });
});

app.listen(port, () => {
  console.log(`Server in port ${port}`);
});
