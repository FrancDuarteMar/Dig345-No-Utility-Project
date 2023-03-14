const express = require('express')
const handlers = require("./lib/handlers")
const multer = require("multer");
const path = require("path");
const fs = require("fs");


var base64Img = require('base64-img');
const {
    engine: expressHandlebars
} = require('express-handlebars')

const upload = multer({
    dest: "./public/uploads"
});
const app = express()
const port = process.env.PORT || 3000

function fileUpload(req, res) {
    {
        const tempPath = req.file.path
        const targetPath = path.join(__dirname, "./public/uploads/image.png")
        console.log("Uploading")
            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    console.log("Error at start of upload. Unknwon error")
                    console.log(err)
                    return handlers.serverError;
                }
                res.status(200)
            });
        
    }

}

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}))

app.set('view engine', 'handlebars')

try {
    fs.unlink("./public/uploads/image.png", (err) => err && console.error(err))
    console.log('successfully deleted image.png');
} catch (error) {
    console.log("Not an error");
}

app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/steganography',handlers.steganography)
app.post("/upload",upload.single("file"),)
app.post('/upload', upload.single('file'), function (req, res){
    fileUpload(req,res)
  });

//404
app.use(handlers.notFound)
// 500
app.use(handlers.serverError)

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Express started on http://localhost:${port}`) + `; press Ctr-C to terminate`
    })
} else {
    module.exports = app
}