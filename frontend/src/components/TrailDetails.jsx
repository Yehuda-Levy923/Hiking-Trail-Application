import { useEffect, useState } from "react";
import { api } from "../api/api";
import TrafficIndicator from "./TrafficIndicator";

export default function TrailDetails({ trailId }) {
    const [trail, setTrail] = useState(null);
    const [traffic, setTraffic] = useState(null);

    useEffect(() => {
        api.get(`/trails/${trailId}`).then(res => setTrail(res.data));
        api.get(`/traffic/${trailId}`).then(res => setTraffic(res.data));
    }, [trailId]);

    if (!trail) return <p>Loading trail...</p>;

    return (
        <div>
            <h2>{trail.name}</h2>
            <p>{trail.description}</p>

            {traffic && <TrafficIndicator level={traffic.congestion_level} />}
        </div>
    );
}
