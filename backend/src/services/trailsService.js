import { pool } from "../config/db.js";

export const fetchTrailDetails = async (id) => {
    const result = await pool.query(
        "SELECT * FROM Trails WHERE id = $1",
        [id]
    );
    return result.rows[0];
};
