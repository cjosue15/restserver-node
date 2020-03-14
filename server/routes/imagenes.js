const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const { verificatTokenIMG } = require('../middlewares/auth');

app.get('/imagen/:tipo/:img', verificatTokenIMG, (req, res) => {
  const { tipo, img } = req.params;

  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  if (!fs.existsSync(pathImg)) {
    const noImage = path.resolve(__dirname, '../assets/no-image.jpg');

    return res.sendFile(noImage);
  }

  res.sendFile(pathImg);
});

module.exports = app;
