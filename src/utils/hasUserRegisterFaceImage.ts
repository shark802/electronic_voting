import { pool } from "../config/database";
import { selectQuery } from "../data_access/query";

export async function hasUserRegisterFaceImage(idNumber: string) {
    const [faceImageRow] = await selectQuery(pool, 'SELECT * FROM face_image WHERE id_number = ? LIMIT 1', [idNumber]);
    const hasRegistered = faceImageRow !== undefined ? true : false;

    return hasRegistered;
}