import { fetchTrailDetails } from "../services/trailsService.js";

export const getTrailDetails = async (req, res) => {
    try {
        const trail = await fetchTrailDetails(req.params.id);
        res.json(trail);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch trail details" });
    }
};
