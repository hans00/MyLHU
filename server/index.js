import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import api from './api'
import urls from '../urls.json'

let app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use( session({
        genid: function(req) {
            return crypto.randomBytes(48).toString('hex')
        },
        secret: crypto.randomBytes(128).toString('hex'),
        resave: true,
        saveUninitialized: true
    })
)

app.all('/', (req, res, next) => {
    var sess = req.session
    //console.log(req.sessionStore)
    console.log(req.sessionID)
    next()
})

app.use(express.static('assets'))
app.use('/api', api(urls))

app.listen(3000, function () {
    console.log('Listening on port 3000!');
})

export default app
