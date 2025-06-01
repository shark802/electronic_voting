"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCertificationDetails = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function updateCertificationDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Received certification update request');
            console.log('Body:', req.body);
            const { certificationDetails } = req.body;
            if (!certificationDetails) {
                console.log('Missing certification details');
                return res.status(400).json({ error: 'Certification details are required' });
            }
            // Create directory if it doesn't exist
            const dirPath = path_1.default.join(__dirname, './../../../public/docs');
            if (!fs_1.default.existsSync(dirPath)) {
                console.log('Creating docs directory');
                fs_1.default.mkdirSync(dirPath, { recursive: true });
            }
            // Save the updated details to a JSON file
            const filePath = path_1.default.join(dirPath, 'certification-details.json');
            console.log('Saving to file:', filePath);
            try {
                fs_1.default.writeFileSync(filePath, JSON.stringify(certificationDetails, null, 2));
                console.log('File saved successfully');
            }
            catch (writeError) {
                console.error('Error writing file:', writeError);
                return res.status(500).json({ error: 'Failed to write certification details to file' });
            }
            return res.status(200).json({
                message: "Certification details updated successfully"
            });
        }
        catch (error) {
            console.error('Error saving certification details:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.updateCertificationDetails = updateCertificationDetails;
