const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Avg = require('./route/avg');
const Correlation = require('./route/correlation')

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


app.use('/',Avg);
app.use('/',Correlation)
app.use((err,res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});