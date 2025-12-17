const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURL = 'mongodb+srv://zeeshananjum623_db_user:Aftab%4099341234@cluster0.legqm91.mongodb.net/';

mongoose.connect(mongoURL);

const db = mongoose.connection;

// Event listeners
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;
