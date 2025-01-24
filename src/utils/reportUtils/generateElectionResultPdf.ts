import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CandidateVoteTally } from "../types/CandidatesVoteTally";

export async function generateElectionResultPdf({
    candidatesVoteTally,
    electionName,
    positionArray,
    departmentArray,
}: {
    candidatesVoteTally: CandidateVoteTally[];
    electionName: string;
    positionArray: string[];
    departmentArray: string[];
}) {

    const pdf = new jsPDF();
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
        const candidatesForPosition = candidatesVoteTally.filter(
            (candidate) => candidate.position === position
        );

        // Render only if there are candidates for the position
        if (candidatesForPosition.length > 0) {
            // Add position header
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${position}`, margin, yPosition);
            yPosition += 6;

            if (position === "SENATOR") {
                departmentArray.forEach((department) => {
                    const candidatesForDepartment = candidatesForPosition.filter(
                        (candidate) => candidate.department === department
                    );

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
                        autoTable(pdf, {
                            startY: yPosition,
                            head: [["Name", "Partylist", "Department", "Vote Count"]],
                            body: tableData,
                            margin: { left: margin },
                            styles: { fontSize: 10 },
                            headStyles: { fillColor: [51, 108, 232] }
                        });

                        // Update yPosition after table
                        yPosition = (pdf as any).lastAutoTable.finalY + 10;
                    }
                });
            } else {
                // Render non-department-specific positions
                const tableData = candidatesForPosition.map((candidate) => [
                    `${candidate.firstname} ${candidate.lastname}`,
                    candidate.party,
                    candidate.department,
                    candidate.vote_count,
                ]);

                // Render table only if there's data
                if (tableData.length > 0) {
                    autoTable(pdf, {
                        startY: yPosition,
                        head: [["Name", "Partylist", "Department", "Vote Count"]],
                        body: tableData,
                        margin: { left: margin },
                        styles: { fontSize: 10 },
                        headStyles: { fillColor: [51, 108, 232] }

                    });

                    // Update yPosition after table
                    yPosition = (pdf as any).lastAutoTable.finalY + 10;
                }
            }
        }
    });


    // Output PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    return pdfBuffer;
}
