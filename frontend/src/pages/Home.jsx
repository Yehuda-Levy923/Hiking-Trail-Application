import TrailDetails from "../components/TrailDetails";
import RefreshButton from "../components/RefreshButton";

export default function Home() {
    return (
        <div>
            <h1>Hiking Trails</h1>
            <RefreshButton />
            <TrailDetails trailId={1} />
        </div>
    );
}
