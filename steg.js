const express = require('express')
const handlers = require("./lib/handlers")
const {
    engine: expressHandlebars
} = require('express-handlebars')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

app.get('/', handlers.home)
app.get('/about', handlers.about)

//404
app.use(handlers.notFound)
// 500
app.use(handlers.serverError)

// app.listen(port, () => console.log(
//     `Express started on http://localhost:${port}; ` +
//     `press Ctrl-C to terminate.`))

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Express started on http://localhost:${port}`) + `; press Ctr-C to terminate`
    })
} else {
    module.exports = app
}