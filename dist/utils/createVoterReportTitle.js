"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoterReportTitle = void 0;
function createVoterReportTitle(voteStatus, department, program, yearLevel, section) {
    let reportTitle = "List of";
    if (voteStatus === 0) {
        reportTitle += ' Not Voted';
    }
    if (voteStatus === 1) {
        reportTitle += ' Voted';
    }
    if (department) {
        reportTitle += ` in ${department} Department`;
    }
    if (program) {
        reportTitle += `, ${program}`;
    }
    if (yearLevel) {
        reportTitle += ` ${yearLevel}`;
    }
    if (program && section) {
        reportTitle += `-${section}`;
    }
    reportTitle += ` students`;
    return reportTitle;
}
exports.createVoterReportTitle = createVoterReportTitle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVm90ZXJSZXBvcnRUaXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGVWb3RlclJlcG9ydFRpdGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLHNCQUFzQixDQUNsQyxVQUFrQixFQUNsQixVQUFtQixFQUNuQixPQUFnQixFQUNoQixTQUFrQixFQUNsQixPQUFnQjtJQUdoQixJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUE7SUFFM0IsSUFBSSxVQUFVLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkIsV0FBVyxJQUFJLFlBQVksQ0FBQTtJQUMvQixDQUFDO0lBRUQsSUFBSSxVQUFVLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkIsV0FBVyxJQUFJLFFBQVEsQ0FBQTtJQUMzQixDQUFDO0lBRUQsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUViLFdBQVcsSUFBSSxPQUFPLFVBQVUsYUFBYSxDQUFBO0lBQ2pELENBQUM7SUFFRCxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ1YsV0FBVyxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUE7SUFDakMsQ0FBQztJQUVELElBQUksU0FBUyxFQUFFLENBQUM7UUFDWixXQUFXLElBQUksSUFBSSxTQUFTLEVBQUUsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7UUFDckIsV0FBVyxJQUFJLElBQUksT0FBTyxFQUFFLENBQUE7SUFFaEMsQ0FBQztJQUVELFdBQVcsSUFBSSxXQUFXLENBQUE7SUFFMUIsT0FBTyxXQUFXLENBQUM7QUFDdkIsQ0FBQztBQXZDRCx3REF1Q0MifQ==