import multer, { Multer } from 'multer';
import path from 'path';

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/img/candidate_profiles')
        cb(null, uploadPath); // Folder where the files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Create the multer instance
const upload: Multer = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|xls|csv/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});

export default upload;
