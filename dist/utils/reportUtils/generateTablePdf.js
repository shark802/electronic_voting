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
        // Add election name (main title)
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let yPosition = margin;
        pdf.setFontSize(18);
        pdf.setFont("helvetica", 'bold');
        const electionNameWidth = pdf.getTextWidth(electionName);
        pdf.text(electionName, (pageWidth - electionNameWidth) / 2, yPosition);
        yPosition += 10;
        // Add report title (subtitle)
        pdf.setFontSize(14);
        pdf.setFont("helvetica", 'normal');
        const reportTitleWidth = pdf.getTextWidth(reportTitle);
        pdf.text(reportTitle, (pageWidth - reportTitleWidth) / 2, yPosition);
        yPosition += 8;
        // Add generation date and time
        const currentDate = new Date();
        const dateTimeString = `Generated on: ${currentDate.toLocaleString()}`;
        pdf.setFontSize(10);
        pdf.setTextColor(100); // Set to a gray color
        const dateTimeWidth = pdf.getTextWidth(dateTimeString);
        pdf.text(dateTimeString, (pageWidth - dateTimeWidth) / 2, yPosition);
        yPosition += 10;
        // Reset text color to black for the rest of the document
        pdf.setTextColor(0);
        // Set the start position for the table
        const startY = yPosition;
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
            startY: startY, // Start position for the table
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVUYWJsZVBkZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZXBvcnRVdGlscy9nZW5lcmF0ZVRhYmxlUGRmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUkxQixTQUFzQixpQkFBaUIsQ0FBQyxLQUFzQixFQUFFLFdBQW1CLEVBQUUsWUFBb0I7O1FBRXJHLGlDQUFpQztRQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO1FBRXhCLGlDQUFpQztRQUNqQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBRXZCLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZFLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFFaEIsOEJBQThCO1FBQzlCLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxH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