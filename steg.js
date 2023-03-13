const express = require('express')
const handlers = require("./lib/handlers")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const steg = require("./lib/steganography")
// const steg = require("./lib/selfSteg")
const steg = require("./lib/greenSteg")
const st = require("./lib/st")

var base64Img = require('base64-img');
const {
    engine: expressHandlebars
} = require('express-handlebars')

const upload = multer({
    dest: "./public/uploads"
});
const app = express()
const port = process.env.PORT || 3000

function uploadedFiles(req, res) {
    var encImg = steg.encode(req.body.textToEncode,base64Img.base64Sync("./public/uploads/image.png"))
    fs.writeFile('./public/uploads/enc.png', encImg, 'base64', function(err){
        if (err) throw err
        console.log('File saved.')
    })    
    res.render("home", {
        img_src: base64Img.base64Sync("./public/uploads/image.png"),
        img_enc: encImg,
        prompt: req.body.mytext
    })
    res.status(200)
}

function decodeFiles(req, res) {
    var decodedText = steg.decode(base64Img.base64Sync("./public/uploads/encoded.png"))
    console.log("Decoded text at steg.js"+decodedText)
    // console.log(encImg)
    res.render("home", {
        img_enc: base64Img.base64Sync("./public/uploads/encoded.png"),
        decoded_text: decodedText
        
    })
}

function encodeUpload(req, res) {
    // console.log(req.body.mytext) 
    {
        const tempPath = req.file.path
        const targetPath = path.join(__dirname, "./public/uploads/image.png")
        console.log("Uploading")
        var extension = path.extname(req.file.originalname).toLowerCase()

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

function encText(req, res) {
    var encImg = st.encode(req.body.mytext,base64Img.base64Sync("./public/uploads/image.png"))
    // console.log(encImg)
    res.render("home", {
        img_src: base64Img.base64Sync("./public/uploads/image.png"),
        img_enc: encImg,
        prompt: req.body.mytext
    })
}

function testEncodeUpload(req, res) {
    {
        const tempPath = req.file.path
        const targetPath = path.join(__dirname, "./public/uploads/image.png")
        console.log("Uploading")
        var extension = path.extname(req.file.originalname).toLowerCase()
        if (extension === ".png" || extension === ".jpg" || extension === ".jpeg") {
            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    console.log("Error at start of upload. Unknwon error")
                    console.log(err)
                    return handlers.serverError;
                }
                res.status(200)
                encText(req, res)
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handlers.serverError;

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
        }
    }

}

function decodeUpload(req, res) {
    // console.log(req.body.mytext) 
    {
        const tempPath = req.file.path
        const targetPath = path.join(__dirname, "./public/uploads/encoded.png")
        console.log("Uploading")
        var extension = path.extname(req.file.originalname).toLowerCase()
        if (extension === ".png" || extension === ".jpg" || extension === ".jpeg") {
            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    console.log("Error at start of upload. Unknwon error")
                    console.log(err)
                    return handlers.serverError;
                }
                res.status(200)
                decodeFiles(req, res)
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handlers.serverError;

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
        }
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
app.get('/decode',handlers.decode)
app.get('/test',handlers.steg)
app.post('/upload', upload.single('file'), function (req, res){
    encodeUpload(req,res)
  });
app.post("/upload", upload.single("file"), encodeUpload)
app.post("/decode", upload.single("file"), decodeUpload)
app.post("/uploadTest",upload.single("file"),testEncodeUpload)


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