const express = require('express')
const handlers = require("./lib/handlers")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var base64Img = require('base64-img');

const {
    engine: expressHandlebars
} = require('express-handlebars')


const upload = multer({dest: "./public/uploads"});

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

try {
    fs.unlink("./public/uploads/image.png",(err) => err && console.error(err))
    console.log('successfully deleted /tmp/hello');
  } catch (error) {
    console.error('there was an error:', error.message);
  }


app.get('/', handlers.home)
app.get('/about', handlers.about)
app.post("/upload",
    upload.single("file"),
    (req, res, next) => {
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
                
                
                  
                res
                .status(200).render("home",{img_src: base64Img.base64Sync("./public/uploads/image.png"), img_enc:base64Img.base64Sync("./public/uploads/encrypt.jpg")})
                // .contentType("text/plain")
                // .end("File uploaded!");
                // next();
                
                
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
);

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