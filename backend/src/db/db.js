const mongoose = require('mongoose');

async function connectdb() {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("connected to db");
}

module.exports = connectdb;
