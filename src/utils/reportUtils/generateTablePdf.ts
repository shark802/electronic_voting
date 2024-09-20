import jsPDF from "jspdf";
import { User } from "../types/User";


export async function genereateTablePdf(users: Partial<User>[], reportTitle: string, electionName: string) {

    // Create a new instance of jsPDF
    const pdf = new jsPDF();

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
    (pdf as any).autoTable({
        head: [['#', 'User ID', 'Full Name', 'Course/Year/Section']], // Table headers
        body: tableBody,  // Table rows data
        startY: 35, // Start position for the table
        styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [0, 0, 0], // Border color
            lineWidth: 0.1  // Border width
        },
        theme: 'grid', // Adds borders to all cells
        didDrawPage: function () {
            // Footer - Page number
            const pageText = `Page ${(pdf.internal as any).getCurrentPageInfo().pageNumber}`;

            pdf.setFontSize(10);
            pdf.text(pageText, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10); // Positioned at bottom-right
        }
    });

    // Generate PDF as a Buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return pdfBuffer;
}