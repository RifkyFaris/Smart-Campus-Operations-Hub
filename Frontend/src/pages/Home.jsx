import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ marginTop: "-2rem", marginInline: "-2rem" }}>
      {/* Top Section - Charcoal Grey */}
      <div style={{ background: "var(--bg-primary)", textAlign: "center", padding: "6rem 2rem 4rem", position: "relative" }}>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", color: "var(--accent-gold)" }}>Welcome to Smart Campus Hub</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 2.5rem", lineHeight: "1.6", fontWeight: "300" }}>
          A premium, full-stack operational dashboard. Manage resources dynamically, book facilities seamlessly, and report incidents elegantly inside one unified platform.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/bookings">
            <button className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1rem", fontWeight: "600" }}>Explore Bookings</button>
          </Link>
          <Link to="/tickets">
            <button className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>Report Incident</button>
          </Link>
        </div>
      </div>

      {/* SVG Wave Divider */}
      <div className="wave-divider" style={{ background: "var(--bg-tertiary)" }}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: "auto" }}>
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" fill="var(--bg-primary)" />
        </svg>
      </div>

      {/* Bottom Section - Teal Accent */}
      <div style={{ background: "var(--bg-tertiary)", padding: "4rem 2rem 8rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "2rem" }}>Discover Premium Facilities</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          
          <div className="glass-panel" style={{ flex: "1 1 300px", maxWidth: "350px", background: "rgba(33, 37, 41, 0.4)", border: "none" }}>
            <div className="circle-frame" style={{ width: "120px", height: "120px", margin: "0 auto 1.5rem", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <span style={{ color: "var(--accent-gold)", fontSize: "2rem", fontFamily: "var(--font-heading)" }}>01</span>
            </div>
            <h3 style={{ color: "var(--accent-gold)" }}>Conference Rooms</h3>
            <p style={{ color: "var(--text-primary)", fontWeight: "300" }}>State-of-the-art meeting spaces designed for collaboration and focus.</p>
          </div>

          <div className="glass-panel" style={{ flex: "1 1 300px", maxWidth: "350px", background: "rgba(33, 37, 41, 0.4)", border: "none" }}>
            <div className="box-frame" style={{ width: "120px", height: "120px", margin: "0 auto 1.5rem", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <span style={{ color: "var(--accent-gold)", fontSize: "2rem", fontFamily: "var(--font-heading)" }}>02</span>
            </div>
            <h3 style={{ color: "var(--accent-gold)" }}>Digital Labs</h3>
            <p style={{ color: "var(--text-primary)", fontWeight: "300" }}>High-performance workstations equipped with the latest software tooling.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
