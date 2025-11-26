import { pool } from "../config/db.js";

export const fetchTraffic = async (trailId) => {
    const res = await pool.query(
        "SELECT * FROM TrafficReports WHERE trail_id = $1 ORDER BY timestamp DESC LIMIT 1",
        [trailId]
    );
    return res.rows[0];
};

export const refreshTrafficData = async () => {
    const res = await pool.query("SELECT * FROM TrafficReports");
    return res.rows;
};
