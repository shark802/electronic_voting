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
const database_1 = require("../config/database");
const query_1 = require("../data_access/query");
const globalEventEmitterInstance_1 = require("./globalEventEmitterInstance");
const nodeMailerConfig_1 = require("../config/nodeMailerConfig");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
globalEventEmitterInstance_1.eventEmitter.on('new-vote', (userId, electionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [userId]);
        const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [electionId]);
        const userEmailAddress = user.email;
        if (!process.env.NODEMAILER_USER || !userEmailAddress)
            return;
        let electionDateStart = new Date(election.date_start);
        const [hour, minute] = election.time_start.split(':');
        electionDateStart.setHours(Number(hour), Number(minute));
        const formattedElectionDate = electionDateStart.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true });
        const currentDate = new Date().toLocaleDateString();
        const subject = 'Vote Confirmation';
        const content = `
            <div style="font-family: Arial, sans-serif; background-color: white; color: black; padding: 20px; border: 1px solid #007BFF;">
                <h2 style="color: #007BFF;">Vote Confirmation</h2>
                <p>Dear ${user.firstname} ${user.lastname},</p>
                <p>Thank you for participating in the <strong>${election.election_name}</strong> held on <strong>${formattedElectionDate}</strong>. We confirm that your vote has been successfully recorded.</p>
                <h3 style="color: #007BFF;">Key Details of Your Voting Activity:</h3>
                <p><strong>Election Name:</strong> ${election.election_name}</p>
                <p><strong>Voting Date:</strong> ${currentDate}</p>
                <p><strong>Voting Time:</strong> ${new Date().toLocaleTimeString()}</p>
                <p>Thank you again for your civic engagement!</p>
                <p>Best regards,<br>BCC Comelec</p>
            </div>
`;
        const options = {
            from: process.env.NODEMAILER_USER,
            to: userEmailAddress, subject,
            html: content
        };
        yield nodeMailerConfig_1.transporter.sendMail(options);
    }
    catch (error) {
        console.error(error);
    }
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZUNvbmZpcm1hdGlvbkVtYWlsRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL3ZvdGVDb25maXJtYXRpb25FbWFpbEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQTBDO0FBQzFDLGdEQUFtRDtBQUVuRCw2RUFBNEQ7QUFDNUQsaUVBQXNFO0FBQ3RFLG9EQUE0QjtBQUc1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLHlDQUFZLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFPLE1BQWMsRUFBRSxVQUFrQixFQUFFLEVBQUU7SUFDckUsSUFBSSxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFPLGVBQUksRUFBRSxpREFBaUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSx1REFBdUQsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDNUgsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXBDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsSUFBSSxDQUFDLGdCQUFnQjtZQUFFLE9BQU87UUFFOUQsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RCxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0scUJBQXFCLEdBQUcsaUJBQWlCLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVuTCxNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDcEQsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUc7OzswQkFHRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRO2dFQUNPLFFBQVEsQ0FBQyxhQUFhLDZCQUE2QixxQkFBcUI7O3FEQUVuRixRQUFRLENBQUMsYUFBYTttREFDeEIsV0FBVzttREFDWCxJQUFJLElBQUksRUFBRSxDQUFDLGtCQUFrQixFQUFFOzs7O0NBSWpGLENBQUM7UUFFTSxNQUFNLE9BQU8sR0FBRztZQUNaLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWU7WUFDakMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLE9BQU87WUFDN0IsSUFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQztRQUVGLE1BQU0sOEJBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFeEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7QUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDIn0=