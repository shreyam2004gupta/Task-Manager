import multer from "multer"

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})
const fileFilter = (req, file, cb) => {
    // Accept common image mimetypes.
    // Some browsers may report variants like image/jpg or image/webp.
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "image/avif",
        "image/bmp",
        "image/tiff",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true)
    }

    return cb(new Error(`Invalid file type: ${file.mimetype}`), false)
}
const upload = multer({ storage, fileFilter })

export default upload
