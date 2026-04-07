import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="glass-panel" style={{ textAlign: "center", padding: "4rem 2rem", marginTop: "2rem" }}>
      <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to Smart Campus Hub</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 2.5rem", lineHeight: "1.6" }}>
        A premium, full-stack operational dashboard. Manage resources dynamically, book facilities seamlessly, and report incidents efficiently inside one unified platform.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/bookings">
          <button className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "1rem" }}>Explore Bookings</button>
        </Link>
        <Link to="/tickets">
          <button className="btn btn-secondary" style={{ padding: "12px 24px", fontSize: "1rem" }}>Report Incident</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
