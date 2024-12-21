"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const cryptoService_1 = require("../cryptoService");
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (votes) => {
    try {
        const secretKey = cryptoService_1.CryptoService.secretKey();
        votes.forEach(vote => {
            try {
                const iv = cryptoService_1.CryptoService.stringToBuffer(vote.encryption_iv);
                // Decrypt and update the candidate_id
                vote.candidate_id = cryptoService_1.CryptoService.decrypt(vote.candidate_id, secretKey, iv);
            }
            catch (decryptError) {
                console.error(`Error decrypting vote:`, decryptError);
            }
        });
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(votes);
    }
    catch (error) {
        console.error(`Error processing votes:`, error);
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ error: error.message });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjcnlwdFZvdGVXb3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvd29ya2VyRmlsZXMvZGVjcnlwdFZvdGVXb3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBNEM7QUFFNUMsb0RBQWlEO0FBRWpELDJCQUFVLGFBQVYsMkJBQVUsdUJBQVYsMkJBQVUsQ0FBRSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDeEMsSUFBSSxDQUFDO1FBQ0QsTUFBTSxTQUFTLEdBQUcsNkJBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUU1QyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pCLElBQUksQ0FBQztnQkFDRCxNQUFNLEVBQUUsR0FBRyw2QkFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTVELHNDQUFzQztnQkFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNoRixDQUFDO1lBQUMsT0FBTyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMxRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCwyQkFBVSxhQUFWLDJCQUFVLHVCQUFWLDJCQUFVLENBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVoRCwyQkFBVSxhQUFWLDJCQUFVLHVCQUFWLDJCQUFVLENBQUUsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFHLEtBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9