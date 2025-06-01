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
exports.updateCertificationDetails = exports.getCertificationForEdit = exports.getCertificationDocument = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const docx_1 = require("docx");
// Helper function to get default content
function getDefaultContent() {
    return `
        <h1 style="text-align: center;">CERTIFICATION</h1>
        <p style="text-align: center;">This is to certify that the election results shown above are true and correct.</p>
        <p>Prepared by:</p>
        <p>_______________________</p>
        <p>Earl John Paildan</p>
        <p><strong>BCC COMELEC Chairperson</strong></p>
        <p>Noted by:</p>
        <p>_______________________                    _______________________</p>
        <p>Mr. Anthony S. Malabanan, MIT              Dr. Rosemarie Lagunday, Ed.D</p>
        <p><strong>MAT-MATH BSIS Department Head              AB Department Head</strong></p>
        <p>_______________________                    _______________________</p>
        <p>Mr. Alain S. Acuna                         Dr. Remedios E. Alvarez, PhD</p>
        <p><strong>Criminology Department Head                Education Department Head</strong></p>
        <p>_______________________</p>
        <p>Ma. Lucille Del Castillo</p>
        <p><strong>SASO Chairperson - Designate</strong></p>
        <p>Approved by:</p>
        <p>_______________________</p>
        <p>Dr. Deborah Natalia E. Singson</p>
        <p><strong>College President</strong></p>
    `;
}
// Get or create certification document
function getCertificationDocument(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filename = 'certification.docx';
            const filePath = path_1.default.join(__dirname, `./../../../public/docs/${filename}`);
            // If file doesn't exist, create it with default content
            if (!fs_1.default.existsSync(filePath)) {
                const doc = new docx_1.Document({
                    sections: [{
                            properties: {},
                            children: [
                                new docx_1.Paragraph({
                                    text: "CERTIFICATION",
                                    heading: docx_1.HeadingLevel.HEADING_1,
                                    alignment: docx_1.AlignmentType.CENTER
                                }),
                                // Prepared by section
                                new docx_1.Paragraph({
                                    text: "Prepared by:",
                                    spacing: {
                                        before: 200
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "_______________________",
                                    alignment: docx_1.AlignmentType.LEFT,
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "Earl John Paildan",
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: "BCC COMELEC Chairperson",
                                            bold: true
                                        })
                                    ],
                                    spacing: {
                                        after: 400
                                    }
                                }),
                                // Noted by section
                                new docx_1.Paragraph({
                                    text: "Noted by:",
                                    spacing: {
                                        before: 200
                                    }
                                }),
                                // First row of Department Heads
                                new docx_1.Paragraph({
                                    text: "_______________________                    _______________________",
                                    alignment: docx_1.AlignmentType.LEFT,
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "Mr. Anthony S. Malabanan, MIT              Dr. Rosemarie Lagunday, Ed.D",
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: "MAT-MATH BSIS Department Head              AB Department Head",
                                            bold: true
                                        })
                                    ],
                                    spacing: {
                                        after: 400
                                    }
                                }),
                                // Second row
                                new docx_1.Paragraph({
                                    text: "_______________________                    _______________________",
                                    alignment: docx_1.AlignmentType.LEFT,
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "Mr. Alain S. Acuna                         Dr. Remedios E. Alvarez, PhD",
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: "Criminology Department Head                Education Department Head",
                                            bold: true
                                        })
                                    ],
                                    spacing: {
                                        after: 400
                                    }
                                }),
                                // Third row (only one person)
                                new docx_1.Paragraph({
                                    text: "_______________________",
                                    alignment: docx_1.AlignmentType.LEFT,
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "Ma. Lucille Del Castillo",
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: "SASO Chairperson - Designate",
                                            bold: true
                                        })
                                    ],
                                    spacing: {
                                        after: 400
                                    }
                                }),
                                // Approved by section
                                new docx_1.Paragraph({
                                    text: "Approved by:",
                                    spacing: {
                                        before: 200
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "_______________________",
                                    alignment: docx_1.AlignmentType.LEFT,
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    text: "Dr. Deborah Natalia E. Singson",
                                    spacing: {
                                        after: 100
                                    }
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: "College President",
                                            bold: true
                                        })
                                    ]
                                })
                            ]
                        }]
                });
                // Create directory if it doesn't exist
                const dirPath = path_1.default.dirname(filePath);
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath, { recursive: true });
                }
                // Save the DOCX file
                const buffer = yield docx_1.Packer.toBuffer(doc);
                fs_1.default.writeFileSync(filePath, buffer);
            }
            // Read and return the content
            const fileBuffer = fs_1.default.readFileSync(filePath);
            const content = fileBuffer.toString();
            res.status(200).json({ content });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getCertificationDocument = getCertificationDocument;
// Get certification details for editing
function getCertificationForEdit(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { election_id } = req.params;
            // Default certification details
            const certificationDetails = {
                preparedBy: {
                    name: "Earl John Paildan",
                    position: "BCC COMELEC Chairperson"
                },
                notedBy: [
                    {
                        name: "Mr. Anthony S. Malabanan, MIT",
                        position: "MAT-MATH BSIS Department Head"
                    },
                    {
                        name: "Dr. Rosemarie Lagunday, Ed.D",
                        position: "AB Department Head"
                    },
                    {
                        name: "Mr. Alain S. Acuna",
                        position: "Criminology Department Head"
                    },
                    {
                        name: "Dr. Remedios E. Alvarez, PhD",
                        position: "Education Department Head"
                    }
                ],
                sasoChairperson: {
                    name: "Ma. Lucille Del Castillo",
                    position: "SASO Chairperson - Designate"
                },
                approvedBy: {
                    name: "Dr. Deborah Natalia E. Singson",
                    position: "College President"
                }
            };
            res.render('admin/editCertification', {
                certificationDetails,
                electionId: election_id
            });
        }
        catch (error) {
            console.error('Error in getCertificationForEdit:', error);
            next(error);
        }
    });
}
exports.getCertificationForEdit = getCertificationForEdit;
// Update certification details
function updateCertificationDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { certificationDetails } = req.body;
            // Save the updated details to a JSON file
            const filePath = path_1.default.join(__dirname, './../../../public/docs/certification-details.json');
            fs_1.default.writeFileSync(filePath, JSON.stringify(certificationDetails, null, 2));
            res.status(200).json({
                message: "Certification details updated successfully"
            });
        }
        catch (error) {
            console.error('Error saving certification details:', error);
            next(error);
        }
    });
}
exports.updateCertificationDetails = updateCertificationDetails;
