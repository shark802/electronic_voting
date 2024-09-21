export function createVoterReportTitle(
    voteStatus: number,
    department?: string,
    program?: string,
    yearLevel?: string,
    section?: string
) {

    let reportTitle = "List of"

    if (voteStatus === 0) {
        reportTitle += ' Not Voted'
    }

    if (voteStatus === 1) {
        reportTitle += ' Voted'
    }

    if (department) {

        reportTitle += ` in ${department} Department`
    }

    if (program) {
        reportTitle += `, ${program}`
    }

    if (yearLevel) {
        reportTitle += ` ${yearLevel}`
    }

    if (program && section) {
        reportTitle += `-${section}`

    }

    reportTitle += ` students`

    return reportTitle;
}
