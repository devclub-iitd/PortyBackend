const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//Body Parser Middleware
app.use(bodyParser.json())

const db = require('./config/keys').mongoURI

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(function () {
        console.log("Connected to the database...")
    })
    .catch(function (err) {
        console.log(err)
    })
//

const user = require('./routes/api/users.js')
const auth = require('./routes/api/auth.js')
const profile = require('./routes/api/profile.js')


app.get('/', function (req, res) {
    res.send("This is the root page!!")
})

app.use('/api/user', user)
app.use('/api/auth', auth)
app.use('/api/profile', profile)

const port = process.env.PORT || 5000

app.listen(port, function () {
    console.log("Server started")
})







