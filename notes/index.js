require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
const express = require('express');
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL);

app.get('/api/notes', async (req, res) => {
  const notes = await sequelize.query('SELECT * FROM notes', { type: QueryTypes.SELECT });
  res.json(notes);
});

const PORT = process.env.port || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const main = async () => {
//   try {
//     await sequelize.authenticate();
//     const notes = await sequelize.query('SELECT * FROM notes', { type: QueryTypes.SELECT });
//     console.log(notes);
//     sequelize.close();
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// main();
