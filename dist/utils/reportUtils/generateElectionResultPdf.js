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
        // Create PDF document with custom options
        const pdf = new jspdf_1.default({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPosition = margin;
        // Add header with logo placeholder
        addHeader(pdf, pageWidth, electionName);
        yPosition = 40;
        // Add summary statistics
        // yPosition = addElectionSummary(pdf, candidatesVoteTally, yPosition, margin, pageWidth);
        yPosition += 10;
        // Add position-specific results
        positionArray.forEach((position) => {
            const candidatesForPosition = candidatesVoteTally.filter((candidate) => candidate.position === position);
            // Render only if there are candidates for the position
            if (candidatesForPosition.length > 0) {
                // Check if we need a new page
                if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = margin;
                    // Add small header on new pages
                    pdf.setFontSize(10);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(`Election Results - ${electionName} (continued)`, margin, margin);
                    yPosition += 10;
                }
                // Add position header
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text(`${formatPositionName(position)}`, margin, yPosition);
                yPosition += 6;
                if (position === "SENATOR") {
                    departmentArray.forEach((department) => {
                        const candidatesForDepartment = candidatesForPosition.filter((candidate) => candidate.department === department);
                        // Render only if there are candidates for the department
                        if (candidatesForDepartment.length > 0) {
                            // Check if we need a new page
                            if (yPosition > pageHeight - 60) {
                                pdf.addPage();
                                yPosition = margin;
                                // Add small header on new pages
                                pdf.setFontSize(10);
                                pdf.setFont("helvetica", "normal");
                                pdf.text(`Election Results - ${electionName} (continued)`, margin, margin);
                                yPosition += 10;
                                // Re-add position header on new page
                                pdf.setFontSize(14);
                                pdf.setFont("helvetica", "bold");
                                pdf.text(`${formatPositionName(position)} (continued)`, margin, yPosition);
                                yPosition += 10;
                            }
                            // Add department header
                            pdf.setFontSize(12);
                            pdf.setFont("helvetica", "italic");
                            pdf.text(`Department: ${department}`, margin, yPosition);
                            yPosition += 6;
                            // Sort candidates by vote count (descending)
                            const sortedCandidates = [...candidatesForDepartment].sort((a, b) => b.vote_count - a.vote_count);
                            // Prepare table data
                            const tableData = sortedCandidates.map((candidate, index) => [
                                index + 1, // Rank
                                `${candidate.firstname} ${candidate.lastname}`,
                                candidate.party || '-',
                                candidate.vote_count,
                                calculatePercentage(candidate.vote_count, getTotalVotes(candidatesForDepartment))
                            ]);
                            // Render table
                            (0, jspdf_autotable_1.default)(pdf, {
                                startY: yPosition,
                                head: [["Rank", "Name", "Partylist", "Vote Count", "Percentage"]],
                                body: tableData,
                                margin: { left: margin, right: margin },
                                styles: {
                                    fontSize: 10,
                                    cellPadding: 3
                                },
                                headStyles: {
                                    fillColor: [51, 108, 232],
                                    textColor: [255, 255, 255],
                                    fontStyle: 'bold'
                                },
                                columnStyles: {
                                    0: { cellWidth: 15 },
                                    3: { halign: 'right' },
                                    4: { halign: 'right' }
                                }
                            });
                            // Update yPosition after table
                            yPosition = pdf.lastAutoTable.finalY + 10;
                        }
                    });
                }
                else {
                    // Sort candidates by vote count (descending)
                    const sortedCandidates = [...candidatesForPosition].sort((a, b) => b.vote_count - a.vote_count);
                    // Render non-department-specific positions
                    const tableData = sortedCandidates.map((candidate, index) => [
                        index + 1, // Rank
                        `${candidate.firstname} ${candidate.lastname}`,
                        candidate.party || '-',
                        candidate.department || '-',
                        candidate.vote_count,
                        calculatePercentage(candidate.vote_count, getTotalVotes(candidatesForPosition))
                    ]);
                    // Render table only if there's data
                    if (tableData.length > 0) {
                        (0, jspdf_autotable_1.default)(pdf, {
                            startY: yPosition,
                            head: [["Rank", "Name", "Partylist", "Department", "Vote Count", "Percentage"]],
                            body: tableData,
                            margin: { left: margin, right: margin },
                            styles: {
                                fontSize: 10,
                                cellPadding: 3
                            },
                            headStyles: {
                                fillColor: [51, 108, 232],
                                textColor: [255, 255, 255],
                                fontStyle: 'bold'
                            },
                            columnStyles: {
                                0: { cellWidth: 15 },
                                4: { halign: 'right' },
                                5: { halign: 'right' }
                            }
                        });
                        // Update yPosition after table
                        yPosition = pdf.lastAutoTable.finalY + 10;
                    }
                }
            }
        });
        // Add footer with page numbers
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            addFooter(pdf, i, totalPages, pageWidth, pageHeight);
        }
        // Output PDF buffer
        const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
        return pdfBuffer;
    });
}
exports.generateElectionResultPdf = generateElectionResultPdf;
// Helper function to add the header section
function addHeader(pdf, pageWidth, electionName) {
    const margin = 15;
    let yPosition = margin;
    // Add election name (main title)
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(51, 108, 232); // Blue color for header
    const electionNameWidth = pdf.getTextWidth(electionName);
    pdf.text(electionName, (pageWidth - electionNameWidth) / 2, yPosition + 10);
    yPosition += 18;
    // Add report title (subtitle)
    const reportTitle = "OFFICIAL ELECTION RESULTS";
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0); // Black color
    const reportTitleWidth = pdf.getTextWidth(reportTitle);
    pdf.text(reportTitle, (pageWidth - reportTitleWidth) / 2, yPosition);
    yPosition += 8;
    // Add generation date and time
    const currentDate = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const dateTimeString = `Generated on: ${currentDate.toLocaleString(undefined, options)}`;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(100); // Gray color
    const dateTimeWidth = pdf.getTextWidth(dateTimeString);
    pdf.text(dateTimeString, (pageWidth - dateTimeWidth) / 2, yPosition);
    // Reset text color
    pdf.setTextColor(0);
    return yPosition;
}
// Helper function to add footer with page numbers
function addFooter(pdf, currentPage, totalPages, pageWidth, pageHeight) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    const pageText = `Page ${currentPage} of ${totalPages}`;
    pdf.text(pageText, pageWidth - 25, pageHeight - 10);
    const footerText = "Confidential - Official Election Results";
    pdf.text(footerText, 15, pageHeight - 10);
    // Add horizontal line above footer
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
}
// Helper function to format position names
function formatPositionName(position) {
    return position
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
// Helper function to calculate percentage
function calculatePercentage(votes, totalVotes) {
    if (totalVotes === 0)
        return "0.00%";
    return (votes / totalVotes * 100).toFixed(2) + "%";
}
// Helper function to get total votes
function getTotalVotes(candidates) {
    return candidates.reduce((sum, candidate) => sum + candidate.vote_count, 0);
}
