const mongoose = require('mongoose');

async function DbConnect() {
  try {
    const DB_URL = process.env.DB_URL;
    await mongoose.connect(DB_URL);
    console.log('DB connected...');
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

module.exports = DbConnect;