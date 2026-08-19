require('dotenv').config();
const express = require('express');
const db = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database terhubung dan tersinkronisasi.');
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Gagal menghubungkan ke database:', err);
});