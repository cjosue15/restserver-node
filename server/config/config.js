// ===========================
// PUERTO
// ===========================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// ENTORNO
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Database
// ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB =
    'mongodb+srv://cjosue15:NCZTlTisKrgfTCFe@cluster0-ucyt8.mongodb.net/cafe';
}

process.env.urlDB = urlDB;
