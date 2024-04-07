const express = require('express')
const connectDB = require('./config/db')

const app = express()
// Connect Database
connectDB()

// Init Middleware

app.use(express.json({ extended: false }))

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('API Running')
})

// Define routes
app.use('/users', require('./routes/api/users'))
app.use('/posts', require('./routes/api/posts'))
app.use('/auth', require('./routes/api/auth'))
app.use('/profile', require('./routes/api/profile'))

app.listen(PORT, () => console.log(`Server started on ${PORT}`))
