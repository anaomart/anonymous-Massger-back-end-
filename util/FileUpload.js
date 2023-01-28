const multer = require('multer');
const path = require('path');

exports.uploadFile = () => {
    console.log("file upload");
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "upload")
        },
        filename: function(req, file, cb) {
            const unique = Date.now() + '-' + Math.round(Math.random() * 10000)
            cb(null, unique + "_" + file.originalname)
        }
    })

    function fileFilter(req, file, cb) {
        console.log(file.mimetype)
        if (file.mimetype.startsWith("image")) {
            cb(null, true)
        } else {
            cb(new Error("Images only supported"), false)
        }
    }
    const upload = multer({ storage })
    return upload.single('image')

}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../upload/")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + "_" + path.extname(file.originalname))
    }

});

const upload = multer({ storage })