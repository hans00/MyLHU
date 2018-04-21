import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import sess_store from 'session-memory-store'
import history from 'connect-history-api-fallback'
import api from './api'
import urls from '../urls.json'
import Schedule from './lib/schedule'

let MemoryStore = sess_store(session)
let app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack')
    const config = require('../config/dev.webpack.config')
    const compiler = webpack(config)

    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
        },
    }))

    app.use(require('webpack-hot-middleware')(compiler))
}

const cachePath = "/tmp/schedule.cache.json"
const schedule = new Schedule(urls.schedule, cachePath)

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
        saveUninitialized: true,
        store: new MemoryStore()
    })
)

app.use((req, res, next) => {
    console.log(req.originalUrl)
    console.log(req.sessionID)
    next()
})

app.use('/api', api(urls))

app.use(history({
    index: 'index.html'
}))

app.use(express.static('assets'))

app.listen(port, function () {
    console.log(`Listening on ${port}!`);
})

export {app, schedule}
