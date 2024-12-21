"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set up storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../public/img/candidate_profiles');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
// Create the multer instance
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|xls|csv/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});
exports.default = upload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGVyQ29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9tdWx0ZXJDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBd0M7QUFDeEMsZ0RBQXdCO0FBRXhCLDRCQUE0QjtBQUM1QixNQUFNLE9BQU8sR0FBRyxnQkFBTSxDQUFDLFdBQVcsQ0FBQztJQUMvQixXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQzNCLE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFDQUFxQyxDQUFDLENBQUE7UUFDOUUsRUFBRSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ0QsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUN4QixFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCw2QkFBNkI7QUFDN0IsTUFBTSxNQUFNLEdBQVcsSUFBQSxnQkFBTSxFQUFDO0lBQzFCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLE1BQU0sRUFBRTtRQUNKLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUM7S0FDNUI7SUFDRCxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQzFCLE1BQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUU5RSxJQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyw2REFBNkQsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxrQkFBZSxNQUFNLENBQUMifQ==