"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.mailOptions = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});
exports.transporter = transporter;
function mailOptions(from, to, subject, content) {
    return {
        from: from,
        to: to,
        subject: subject,
        text: content,
    };
}
exports.mailOptions = mailOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZU1haWxlckNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWcvbm9kZU1haWxlckNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsTUFBTSxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxlQUFlLENBQUM7SUFDM0MsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsR0FBRztJQUNULE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTtRQUNqQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7S0FDeEM7Q0FDSixDQUFDLENBQUM7QUFXTSxrQ0FBVztBQVRwQixTQUFnQixXQUFXLENBQUMsSUFBWSxFQUFFLEVBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZTtJQUNsRixPQUFPO1FBQ0gsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsRUFBRTtRQUNOLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRSxPQUFPO0tBQ2hCLENBQUE7QUFDTCxDQUFDO0FBUEQsa0NBT0MifQ==