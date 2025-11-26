export default function TrafficIndicator({ level }) {
    const colors = ["gray", "green", "yellow", "orange", "red"];

    return (
        <div style={{ background: colors[level - 1], padding: 10, borderRadius: 8 }}>
            Traffic Level: {level}
        </div>
    );
}
