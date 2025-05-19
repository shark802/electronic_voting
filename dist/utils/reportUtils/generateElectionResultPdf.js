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
/**
 * Generates a formal election results PDF document
 * @param params - Configuration parameters for the PDF generation
 * @returns Promise with PDF buffer
 */
function generateElectionResultPdf(_a) {
    return __awaiter(this, arguments, void 0, function* ({ candidatesVoteTally, electionName, positionArray, departmentArray, }) {
        // Initialize PDF document
        const pdf = new jspdf_1.default({ orientation: "portrait", unit: "mm", format: "a4" });
        const { width: pageWidth, height: pageHeight } = pdf.internal.pageSize;
        const margin = 12;
        let yPosition = margin;
        // Add header with title and date
        yPosition = renderHeader(pdf, pageWidth, electionName) + 8;
        // Process each position
        for (const position of positionArray) {
            const candidatesForPosition = candidatesVoteTally.filter((candidate) => candidate.position === position);
            if (!candidatesForPosition.length)
                continue;
            // Check if we need a new page
            if (yPosition > pageHeight - 60) {
                pdf.addPage();
                yPosition = renderContinuationHeader(pdf, electionName, margin) + 10;
            }
            // Add position header
            yPosition = renderPositionHeader(pdf, position, margin, yPosition) + 6;
            // Render either by department (for senators) or directly
            if (position === "SENATOR") {
                yPosition = renderSenatorsByDepartment(pdf, candidatesForPosition, departmentArray, electionName, position, margin, yPosition, pageHeight);
            }
            else {
                yPosition = renderCandidatesTable(pdf, candidatesForPosition, margin, yPosition) + 10;
            }
        }
        // Add signatures section
        yPosition = renderSignatures(pdf, pageWidth, pageHeight, yPosition);
        // Add footer with page numbers
        addFooters(pdf, pageWidth, pageHeight);
        // Return PDF buffer
        return Buffer.from(pdf.output("arraybuffer"));
    });
}
exports.generateElectionResultPdf = generateElectionResultPdf;
/**
 * Renders the main document header
 */
function renderHeader(pdf, pageWidth, electionName) {
    // Main title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 90, 180);
    const electionNameWidth = pdf.getTextWidth(electionName);
    pdf.text(electionName, (pageWidth - electionNameWidth) / 2, 22);
    // Subtitle
    const reportTitle = "OFFICIAL ELECTION RESULTS";
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    const reportTitleWidth = pdf.getTextWidth(reportTitle);
    pdf.text(reportTitle, (pageWidth - reportTitleWidth) / 2, 30);
    // Generation timestamp
    const dateTimeString = `Generated on: ${new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(100);
    const dateTimeWidth = pdf.getTextWidth(dateTimeString);
    pdf.text(dateTimeString, (pageWidth - dateTimeWidth) / 2, 34);
    pdf.setTextColor(0);
    return 42;
}
/**
 * Renders a continuation header for subsequent pages
 */
function renderContinuationHeader(pdf, electionName, margin) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Election Results - ${electionName} (continued)`, margin, margin);
    return margin;
}
/**
 * Renders the position header
 */
function renderPositionHeader(pdf, position, margin, yPosition) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(formatPositionName(position).toUpperCase(), margin, yPosition);
    return yPosition;
}
/**
 * Renders senators grouped by department
 */
function renderSenatorsByDepartment(pdf, candidatesForPosition, departmentArray, electionName, position, margin, yPosition, pageHeight) {
    for (const department of departmentArray) {
        const candidatesForDepartment = candidatesForPosition.filter((candidate) => candidate.department_name === department);
        if (!candidatesForDepartment.length)
            continue;
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = margin;
            // Add continuation headers
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Election Results - ${electionName} (continued)`, margin, margin);
            yPosition += 10;
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${formatPositionName(position)} (continued)`, margin, yPosition);
            yPosition += 10;
        }
        // Add department header
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        pdf.text(`Department: ${department}`, margin, yPosition);
        yPosition += 3;
        // Render table for this department
        yPosition = renderCandidatesTable(pdf, candidatesForDepartment, margin, yPosition) + 10;
    }
    return yPosition;
}
/**
 * Renders the candidates table
 */
function renderCandidatesTable(pdf, candidates, margin, yPosition) {
    // Sort candidates by vote count (descending)
    const sortedCandidates = [...candidates].sort((a, b) => b.vote_count - a.vote_count);
    const totalVotes = getTotalVotes(candidates);
    // Prepare table data
    const tableData = sortedCandidates.map((candidate, index) => [
        index + 1, // Rank
        `${candidate.firstname} ${candidate.lastname}`,
        candidate.party || '-',
        candidate.course || '-',
        candidate.vote_count,
        calculatePercentage(candidate.vote_count, totalVotes)
    ]);
    // Skip if no data
    if (!tableData.length)
        return yPosition;
    // Render table
    (0, jspdf_autotable_1.default)(pdf, {
        startY: yPosition,
        head: [["Rank", "Name", "Partylist", "Course", "Vote Count", "Percentage"]],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: {
            fillColor: [51, 108, 232],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 15 },
            4: { halign: 'center' },
            5: { halign: 'center' }
        }
    });
    return pdf.lastAutoTable.finalY;
}
/**
 * Renders signature section at the end of the document
 */
function renderSignatures(pdf, pageWidth, pageHeight, yPosition) {
    // Always create a new page for signatures
    pdf.addPage();
    yPosition = 30;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("CERTIFICATION", pageWidth / 2 - 20, yPosition);
    yPosition += 15;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    // Column position
    const leftColX = 30;
    const rightColX = pageWidth - 80;
    // First row label
    pdf.text("Prepared by:", leftColX, yPosition);
    yPosition += 10;
    // Prepared by signature
    pdf.text("_______________________", leftColX, yPosition);
    yPosition += 5;
    pdf.text("Earl John Paildan", leftColX, yPosition);
    yPosition += 5;
    pdf.setFont("helvetica", "bold");
    pdf.text("BCC COMELEC Chairperson", leftColX, yPosition);
    pdf.setFont("helvetica", "normal");
    // "Noted by" section
    yPosition += 25;
    pdf.text("Noted by:", leftColX, yPosition);
    yPosition += 10;
    // First row of Department Heads
    pdf.text("_______________________", leftColX, yPosition);
    pdf.text("_______________________", rightColX, yPosition);
    yPosition += 5;
    pdf.text("Mr. Anthony S. Malabanan, MIT", leftColX, yPosition);
    pdf.text("Dr. Rosemarie Lagunday, Ed.D", rightColX, yPosition);
    yPosition += 5;
    pdf.setFont("helvetica", "bold");
    pdf.text("MAT-MATH BSIS Department Head", leftColX, yPosition);
    pdf.text("AB Department Head", rightColX, yPosition);
    pdf.setFont("helvetica", "normal");
    // Second row
    yPosition += 25;
    pdf.text("_______________________", leftColX, yPosition);
    pdf.text("_______________________", rightColX, yPosition);
    yPosition += 5;
    pdf.text("Mr. Alain S. Acuna", leftColX, yPosition);
    pdf.text("Dr. Remedios E. Alvarez, PhD", rightColX, yPosition);
    yPosition += 5;
    pdf.setFont("helvetica", "bold");
    pdf.text("Criminology Department Head", leftColX, yPosition);
    pdf.text("Education Department Head", rightColX, yPosition);
    pdf.setFont("helvetica", "normal");
    // Third row (only one person now)
    yPosition += 25;
    pdf.text("_______________________", leftColX, yPosition);
    yPosition += 5;
    pdf.text("Ma. Lucille Del Castillo", leftColX, yPosition);
    yPosition += 5;
    pdf.setFont("helvetica", "bold");
    pdf.text("SASO Chairperson - Designate", leftColX, yPosition);
    pdf.setFont("helvetica", "normal");
    // Approved by section moved to bottom left
    yPosition += 25;
    pdf.text("Approved by:", leftColX, yPosition);
    yPosition += 10;
    pdf.text("_______________________", leftColX, yPosition);
    yPosition += 5;
    pdf.text("Dr. Deborah Natalia E. Singson", leftColX, yPosition);
    yPosition += 5;
    pdf.setFont("helvetica", "bold");
    pdf.text("College President", leftColX, yPosition);
    pdf.setFont("helvetica", "normal");
    return yPosition + 15;
}
/**
 * Adds footers to all pages
 */
function addFooters(pdf, pageWidth, pageHeight) {
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        // Draw footer line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
        // Add page number and footer text
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
        pdf.text("Confidential - Official Election Results", 15, pageHeight - 10);
    }
}
/**
 * Formats position names from snake_case to Title Case
 */
function formatPositionName(position) {
    return position
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
/**
 * Calculates percentage with 2 decimal places
 */
function calculatePercentage(votes, totalVotes) {
    if (totalVotes === 0)
        return "0.00%";
    return `${(votes / totalVotes * 100).toFixed(2)}%`;
}
/**
 * Gets total votes for a set of candidates
 */
function getTotalVotes(candidates) {
    return candidates.reduce((sum, candidate) => sum + candidate.vote_count, 0);
}
