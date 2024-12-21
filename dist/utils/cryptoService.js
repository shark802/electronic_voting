"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CryptoService {
    static encrypt(dataToEncrypt, secretKey, iv) {
        const cipher = crypto_1.default.createCipheriv(this.ALGORITHM, secretKey, iv);
        let encrypted = cipher.update(dataToEncrypt, this.INPUT_ENCODING, this.OUTPUT_ENCODING);
        encrypted += cipher.final(this.OUTPUT_ENCODING);
        return encrypted;
    }
    static decrypt(encryptedData, secretKey, iv) {
        const decipher = crypto_1.default.createDecipheriv(this.ALGORITHM, secretKey, iv);
        let decrypted = decipher.update(encryptedData, this.OUTPUT_ENCODING, this.INPUT_ENCODING);
        decrypted += decipher.final(this.INPUT_ENCODING);
        return decrypted;
    }
    static secretKey() {
        const key = '65a6b1c3ba49d76236d34006db51d32a258f28026921fa87f97662737971d9f5';
        return Buffer.from(key, 'hex');
    }
    static generateIv() {
        return crypto_1.default.randomBytes(16).toString('hex');
    }
    static stringToBuffer(data) {
        return Buffer.from(data, 'hex');
    }
}
exports.CryptoService = CryptoService;
CryptoService.ALGORITHM = 'aes-256-cbc';
CryptoService.INPUT_ENCODING = 'utf8';
CryptoService.OUTPUT_ENCODING = 'hex';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcnlwdG9TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUE0QjtBQUU1QixNQUFhLGFBQWE7SUFLdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFrQixFQUFFLFNBQWlCLEVBQUUsRUFBVTtRQUM1RCxNQUFNLE1BQU0sR0FBRyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RixTQUFTLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDaEQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBcUIsRUFBRSxTQUFpQixFQUFFLEVBQVU7UUFDL0QsTUFBTSxRQUFRLEdBQUcsZ0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RSxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRixTQUFTLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTO1FBQ1osTUFBTSxHQUFHLEdBQUcsa0VBQWtFLENBQUM7UUFDL0UsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVU7UUFDYixPQUFPLGdCQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFZO1FBQzlCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQzs7QUE5Qkwsc0NBK0JDO0FBOUIyQix1QkFBUyxHQUFHLGFBQWEsQ0FBQztBQUMxQiw0QkFBYyxHQUFHLE1BQU0sQ0FBQztBQUN4Qiw2QkFBZSxHQUFHLEtBQUssQ0FBQyJ9