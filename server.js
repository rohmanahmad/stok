const {join} = require('path')
const mongodbConnection = require('./modules/libs/mongodb')
const express = require('express')
const backendRoutes = require('./modules/routes/backendRoutes')
const frontendRoutes = require('./modules/routes/frontendRoutes')
const app = express()
const port = 3000

app.use(express.static('public', {}))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug')
app.set('views', join(__dirname, 'modules/views'))

app.use((req, res, next) => {
    console.log('- accessing ', req.originalUrl)
    next()
})
app.use('/api', backendRoutes)
app.use('/', frontendRoutes)

app.all('*', (req, res) => {
    res
        .status(404)
        .send({
            status: 404,
            version: '0.1.0',
            message: 'Path Not Found'
        })
})

mongodbConnection()
    .then(function () {
        app.listen(port, console.log(`app listen on ${port}`))
    })
    .catch((err) => {
        console.log(err)
        process.exit(0)
    })
