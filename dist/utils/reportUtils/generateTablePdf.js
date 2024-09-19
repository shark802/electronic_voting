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
exports.genereateTablePdf = void 0;
const jspdf_1 = __importDefault(require("jspdf"));
function genereateTablePdf(users, reportTitle, electionName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a new instance of jsPDF
        const pdf = new jspdf_1.default();
        // Add title
        pdf.setFontSize(12);
        pdf.text(reportTitle, 15, 15);
        pdf.setFontSize(14);
        pdf.text(electionName, 15, 25);
        // Prepare table data
        const tableBody = users.map((user, index) => [
            index + 1,
            user.id_number,
            `${user.lastname}, ${user.firstname}`,
            `${user.course} ${user.year_level} - ${user.section}`
        ]);
        // Add the table using autoTable and page numbers
        pdf.autoTable({
            head: [['#', 'User ID', 'Full Name', 'Course/Year/Section']], // Table headers
            body: tableBody, // Table rows data
            startY: 35, // Start position for the table
            styles: {
                fontSize: 8,
                cellPadding: 3,
                lineColor: [0, 0, 0], // Border color
                lineWidth: 0.1 // Border width
            },
            theme: 'grid', // Adds borders to all cells
            didDrawPage: function () {
                // Footer - Page number
                const pageText = `Page ${pdf.internal.getCurrentPageInfo().pageNumber}`;
                pdf.setFontSize(10);
                pdf.text(pageText, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10); // Positioned at bottom-right
            }
        });
        // Generate PDF as a Buffer
        const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
        return pdfBuffer;
    });
}
exports.genereateTablePdf = genereateTablePdf;
