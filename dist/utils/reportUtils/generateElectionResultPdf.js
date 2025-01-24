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
exports.generateElectionResultPdf = void 0;
const jspdf_1 = __importDefault(require("jspdf"));
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
function generateElectionResultPdf(_a) {
    return __awaiter(this, arguments, void 0, function* ({ candidatesVoteTally, electionName, positionArray, departmentArray, }) {
        const pdf = new jspdf_1.default();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let yPosition = margin;
        // Add election name (main title)
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        const electionNameWidth = pdf.getTextWidth(electionName);
        pdf.text(electionName, (pageWidth - electionNameWidth) / 2, yPosition);
        yPosition += 8;
        // Add report title (subtitle)
        const reportTitle = "Election Result";
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "normal");
        const reportTitleWidth = pdf.getTextWidth(reportTitle);
        pdf.text(reportTitle, (pageWidth - reportTitleWidth) / 2, yPosition);
        yPosition += 6;
        // Add generation date and time
        const currentDate = new Date();
        const dateTimeString = `Generated on: ${currentDate.toLocaleString()}`;
        pdf.setFontSize(10);
        pdf.setTextColor(100); // Set to a gray color
        const dateTimeWidth = pdf.getTextWidth(dateTimeString);
        pdf.text(dateTimeString, (pageWidth - dateTimeWidth) / 2, yPosition);
        yPosition += 15;
        // Reset text color to black
        pdf.setTextColor(0);
        positionArray.forEach((position) => {
            const candidatesForPosition = candidatesVoteTally.filter((candidate) => candidate.position === position);
            // Render only if there are candidates for the position
            if (candidatesForPosition.length > 0) {
                // Add position header
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text(`${position}`, margin, yPosition);
                yPosition += 6;
                if (position === "SENATOR") {
                    departmentArray.forEach((department) => {
                        const candidatesForDepartment = candidatesForPosition.filter((candidate) => candidate.department === department);
                        // Render only if there are candidates for the department
                        if (candidatesForDepartment.length > 0) {
                            // Add department header
                            pdf.setFontSize(11);
                            pdf.setFont("helvetica", "italic");
                            pdf.text(`Department: ${department}`, margin, yPosition); // Set x coordinate to margin
                            yPosition += 2;
                            // Prepare table data
                            const tableData = candidatesForDepartment.map((candidate) => [
                                `${candidate.firstname} ${candidate.lastname}`,
                                candidate.party,
                                candidate.department,
                                candidate.vote_count,
                            ]);
                            // Render table
                            (0, jspdf_autotable_1.default)(pdf, {
                                startY: yPosition,
                                head: [["Name", "Partylist", "Department", "Vote Count"]],
                                body: tableData,
                                margin: { left: margin },
                                styles: { fontSize: 10 },
                                headStyles: { fillColor: [51, 108, 232] }
                            });
                            // Update yPosition after table
                            yPosition = pdf.lastAutoTable.finalY + 10;
                        }
                    });
                }
                else {
                    // Render non-department-specific positions
                    const tableData = candidatesForPosition.map((candidate) => [
                        `${candidate.firstname} ${candidate.lastname}`,
                        candidate.party,
                        candidate.department,
                        candidate.vote_count,
                    ]);
                    // Render table only if there's data
                    if (tableData.length > 0) {
                        (0, jspdf_autotable_1.default)(pdf, {
                            startY: yPosition,
                            head: [["Name", "Partylist", "Department", "Vote Count"]],
                            body: tableData,
                            margin: { left: margin },
                            styles: { fontSize: 10 },
                            headStyles: { fillColor: [51, 108, 232] }
                        });
                        // Update yPosition after table
                        yPosition = pdf.lastAutoTable.finalY + 10;
                    }
                }
            }
        });
        // Output PDF buffer
        const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
        return pdfBuffer;
    });
}
exports.generateElectionResultPdf = generateElectionResultPdf;
