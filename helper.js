const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        req.fileValidationError = 'Only Excel files are allowed!';
        return cb(new Error('Only Excel files are allowed!'), false);
    }
    cb(null, true);
}

exports.imageFilter = imageFilter;