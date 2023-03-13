const express = require('express')
const handlers = require("./lib/handlers")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const steg = require("./lib/steganography")
const steg = require("./lib/selfSteg")

var base64Img = require('base64-img');
const {
    engine: expressHandlebars
} = require('express-handlebars')

const upload = multer({
    dest: "./public/uploads"
});
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,__dirname+'./public/uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, uuidv4() + "image"+`.png`) //Appending extension
//     }
//   });

// const upload = multer({ storage: storage });

const app = express()
const port = process.env.PORT || 3000

function uploadedFiles(req, res) {
    var encImg = steg.encode(req.body.textToEncode, "./public/uploads/image.png", "./public/uploads/encrypt.jpg")
    console.log(encImg)
    fs.writeFile('./public/uploads/enc.png', encImg, 'base64', function(err){
        if (err) throw err
        console.log('File saved.')
    })
    res.render("home", {
        img_src: base64Img.base64Sync("./public/uploads/image.png"),
        img_enc: encImg,
        prompt: req.body.textToEncode
    })
    res.status(200)

}

function finishedUpload(req, res) {
    console.log(req.body.textToEncode)
    // console.log(req.body.myatext) 
    console.log("Uploaded file")
    {
        const tempPath = req.file.path
        console.log("TEMP PATH: "+tempPath)
        const targetPath = path.join(__dirname, "./public/uploads/image.png")
        console.log("Uploading")
        fs.rename(tempPath, targetPath, err => {
            if (err) {
                console.log("Error at start of upload. Unknwon error")
                console.log(err)
                return handlers.serverError;
            }               
            uploadedFiles(req, res)
        });
    }
}


app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}))
app.use(express.static(__dirname + '/public'))


app.set('view engine', 'handlebars')

try {
    fs.unlink("./public/uploads/image.png", (err) => err && console.error(err))
    console.log('successfully deleted image.png');
} catch (error) {
    console.log("Not an error");
}


app.get('/', handlers.home)
app.get('/about', handlers.about)
// app.post("/upload", upload.single("file"), finishedUpload);
app.post('/upload', upload.single('file'), function (req, res){
    // req.file contains info about file.
    console.log(req.file);
    // res.json(req.file);
    finishedUpload(req,res)
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