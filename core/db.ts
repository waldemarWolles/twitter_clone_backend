const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twitter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

export { db, mongoose }
