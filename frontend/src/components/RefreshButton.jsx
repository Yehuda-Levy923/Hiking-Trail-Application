import { api } from "../api/api";

export default function RefreshButton() {
    const refresh = () => {
        api.get("/traffic/refresh/all");
        alert("Traffic refreshed");
    };

    return <button onClick={refresh}>Refresh Traffic</button>;
}
