const multer = require('multer');

// Configure storage
// This will set image upload destination to “uploads” folder 
// and filename will be same as uploaded file’s original name.
// here cb is callBack
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '../server/public/uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})


// Only accept the file if it is of type image
function fileFilter(req, file,cb){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload;