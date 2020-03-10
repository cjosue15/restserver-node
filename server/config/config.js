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
  urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ===========================
// Token Expiracion
// ===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '1h';

// ===========================
// Token SEED - autenticacion
// ===========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===========================
// Google CLIENT_ID
// ===========================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  '797792600002-npj1mmuhtsr32dcarjsiub45ii3ffan1.apps.googleusercontent.com';
