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
exports.getAllCompleteElection = exports.getDepartmentsTotalVotes = exports.getDepartmentsTotalPopulation = exports.totalUserVotedPerElection = exports.getAllCandidatesInElection = exports.getCandidatesTotalTally = exports.generateElectionResult = exports.getElectionResult = exports.getElectionInfoById = void 0;
const database_1 = require("../config/database");
const query_1 = require("./query");
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const cryptoService_1 = require("../utils/cryptoService");
function getElectionInfoById(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL', [electionId]);
        return election;
    });
}
exports.getElectionInfoById = getElectionInfoById;
function getElectionResult(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM election_results WHERE election_id = ?', [electionId]);
        return result ? result : null;
    });
}
exports.getElectionResult = getElectionResult;
function generateElectionResult(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const votes = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM votes WHERE election_id = ?', [electionId]);
        const secretKey = cryptoService_1.CryptoService.secretKey();
        if (votes.length === 0) {
            const iv = cryptoService_1.CryptoService.generateIv();
            const encryptionIv = cryptoService_1.CryptoService.stringToBuffer(iv);
            const dataToEncrypt = JSON.stringify(votes);
            const encryptVoteResult = cryptoService_1.CryptoService.encrypt(dataToEncrypt, secretKey, encryptionIv);
            yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO election_results (election_id, result, encryption_iv) VALUES(?, ?, ?)', [electionId, encryptVoteResult, iv]);
            return votes;
        }
        else {
            return new Promise((resolve, reject) => {
                try {
                    const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, '../utils/workerFiles/decryptVoteWorker.js'));
                    worker.postMessage(votes);
                    worker.on('message', (decryptedVotes) => __awaiter(this, void 0, void 0, function* () {
                        const candidatesData = yield getCandidatesTotalTally(electionId);
                        const voteTally = candidatesData.map(candidate => {
                            const vote_count = decryptedVotes.filter(vote => Number(vote.candidate_id) === Number(candidate.id_number)).length;
                            return Object.assign(Object.assign({}, candidate), { vote_count });
                        });
                        const iv = cryptoService_1.CryptoService.generateIv();
                        const encryptionIv = cryptoService_1.CryptoService.stringToBuffer(iv);
                        const dataToEncrypt = JSON.stringify(voteTally);
                        const encryptVoteResult = cryptoService_1.CryptoService.encrypt(dataToEncrypt, secretKey, encryptionIv);
                        yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO election_results (election_id, result, encryption_iv) VALUES(?, ?, ?)', [electionId, encryptVoteResult, iv]);
                        resolve(voteTally);
                    }));
                }
                catch (error) {
                    reject(error);
                }
            });
        }
    });
}
exports.generateElectionResult = generateElectionResult;
function getCandidatesTotalTally(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT c.position, c.party, c.department, MAX(c.candidate_profile) AS candidate_profile, u.id_number, u.lastname, u.firstname, u.course, c.election_id
        FROM candidates c
        LEFT JOIN users u ON u.id_number = c.id_number     
        WHERE c.election_id = ? AND c.deleted IS NULL
        GROUP BY c.position, u.id_number, u.lastname, u.firstname, u.course, c.party, c.department;
    `;
        const candidatesVoteTally = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId]);
        return candidatesVoteTally;
    });
}
exports.getCandidatesTotalTally = getCandidatesTotalTally;
function getAllCandidatesInElection(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, c.position
        FROM users u
        JOIN candidates c ON u.id_number = c.id_number
        WHERE election_id = ? AND c.deleted IS NULL AND c.enabled = 1
    `;
        const candidates = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId]); // Assuming selectQuery automatically binds parameters
        return candidates;
    });
}
exports.getAllCandidatesInElection = getAllCandidatesInElection;
function totalUserVotedPerElection() {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT e.election_id, COUNT(DISTINCT v.voter_id) AS total_voted
        FROM elections e
        JOIN votes v ON e.election_id = v.election_id
        WHERE e.is_close = 0
        GROUP BY e.election_id;
    `;
        const totalVoted = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery);
        return totalVoted;
    });
}
exports.totalUserVotedPerElection = totalUserVotedPerElection;
function getDepartmentsTotalPopulation(electionIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
        const electionDepartmentTotalPopulation = []; // will accumulate all elections vote summary per department
        for (const electionId of electionIdArray) {
            const departmentTotalPopulation = {
                election_id: electionId,
                department_total_population: {}
            };
            for (const department of departments) {
                const [result] = yield (0, query_1.selectQuery)(database_1.pool, `SELECT * FROM program_populations WHERE election_id = ? AND program_code = ?`, [electionId, department.department_code]);
                departmentTotalPopulation.department_total_population[department.department_code] = (result ? result.program_population : 0);
            }
            electionDepartmentTotalPopulation.push(departmentTotalPopulation);
        }
        return electionDepartmentTotalPopulation;
    });
}
exports.getDepartmentsTotalPopulation = getDepartmentsTotalPopulation;
function getDepartmentsTotalVotes(electionIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
        const programs = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE deleted_at IS NULL');
        const sqlQuery = `
        SELECT COUNT(DISTINCT v.voter_id) as total_voted, v.election_id
        FROM votes v
        LEFT JOIN users u
        ON v.voter_id = u.id_number
        WHERE u.course IN (?) AND v.election_id = ?
        GROUP BY v.election_id
    `;
        const departmentVotesSummary = []; // will accumulate all elections vote summary per department
        for (const electionId of electionIdArray) {
            const electionDepartmentVoteSummary = {
                election_id: electionId,
                department_votes: {} // Initialized as an empty object with correct type
            };
            for (const department of departments) {
                const programList = programs.filter(program => program.department === department.department_id).map(program => program.program_code);
                if (programList.length === 0) {
                    electionDepartmentVoteSummary.department_votes[department.department_code] = 0;
                }
                else {
                    const [result] = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [programList, electionId]);
                    // Cast departmentCode to DepartmentCode type
                    electionDepartmentVoteSummary.department_votes[department.department_code] = result ? result.total_voted : 0;
                }
            }
            departmentVotesSummary.push(electionDepartmentVoteSummary);
        }
        return departmentVotesSummary;
    });
}
exports.getDepartmentsTotalVotes = getDepartmentsTotalVotes;
function getAllCompleteElection() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectSqlQuery = 'SELECT * FROM elections WHERE (date_end < CURDATE() OR (date_end = CURDATE() AND time_end < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC';
        const elections = yield (0, query_1.selectQuery)(database_1.pool, selectSqlQuery);
        return elections;
    });
}
exports.getAllCompleteElection = getAllCompleteElection;
