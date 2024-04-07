const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log('mongo db connected')
  } catch (err) {
    console.error(err.message)
    // Exit process
    process.exit(1)
  }
}

module.exports = connectDB
