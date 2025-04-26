import jsPDF from "jspdf";
import 'jspdf-autotable';
import { User } from "../types/User";
import autoTable, { RowInput } from "jspdf-autotable";

export async function genereateTablePdf(users: Partial<User>[], reportTitle: string, electionName: string) {
    // Create a new instance of jsPDF
    const pdf = new jsPDF();

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
    pdf.setTextColor(100);  // Set to a gray color
    const dateTimeWidth = pdf.getTextWidth(dateTimeString);
    pdf.text(dateTimeString, (pageWidth - dateTimeWidth) / 2, yPosition);
    yPosition += 8;

    // Reset text color to black for the rest of the document
    pdf.setTextColor(0);

    // Set the start position for the table
    const startY = yPosition;

    // Prepare table data - ensure it's properly typed
    const tableBody: RowInput[] = users.map((user, index) => [
        (index + 1).toString(),
        user.id_number || '',
        `${user.lastname || ''}, ${user.firstname || ''}`,
        `${user.course || ''} ${user.year_level || ''} - ${user.section || ''}`
    ]);

    // Use type assertion for pdf
    autoTable(pdf, {
        head: [['#', 'User ID', 'Full Name', 'Course/Year/Section']], // Table headers
        body: tableBody,  // Table rows data
        startY: startY, // Start position for the table
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: { fillColor: [51, 108, 232] },
        theme: 'grid', // Adds borders to all cells
        didDrawPage: function () {
            // Footer - Page number
            const pageInfo = (pdf.internal as any).getCurrentPageInfo();
            const pageText = `Page ${pageInfo.pageNumber}`;

            pdf.setFontSize(10);
            pdf.text(pageText, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
        }
    });

    // Generate PDF as a Buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return pdfBuffer;
}