export default function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ marginTop: "16px" }}>{message}</p>
    </div>
  );
}
