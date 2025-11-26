import { fetchTraffic, refreshTrafficData } from "../services/trafficService.js";

export const getTraffic = async (req, res) => {
    try {
        const traffic = await fetchTraffic(req.params.trailId);
        res.json(traffic);
    } catch (e) {
        res.status(500).json({ error: "Failed to load traffic" });
    }
};

export const refreshTraffic = async (req, res) => {
    try {
        const updated = await refreshTrafficData();
        res.json(updated);
    } catch {
        res.status(500).json({ error: "Failed to refresh traffic" });
    }
};
