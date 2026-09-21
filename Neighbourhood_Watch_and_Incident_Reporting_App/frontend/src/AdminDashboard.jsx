import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function AdminDashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [incidentsResponse,usersResponse,dashboardResponse,] = await Promise.all([
  		fetch(`${API_BASE}/api/incidents/list/`),
  		fetch(`${API_BASE}/api/users/list/`),
  		fetch(`${API_BASE}/api/users/dashboard/`),
	]);
        if (!incidentsResponse.ok) {
          throw new Error("Failed to fetch incidents");
        }
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }
	if (!dashboardResponse.ok) {
  	  throw new Error("Failed to fetch dashboard");
	}
        const incidentsData = await incidentsResponse.json();
	const usersData = await usersResponse.json();
	const dashboardData = await dashboardResponse.json();
	setDashboard(dashboardData);
        setIncidents(
          Array.isArray(incidentsData)
            ? incidentsData
            : incidentsData.results || []
        );

        setUsers(
          Array.isArray(usersData)
            ? usersData
            : usersData.results || []
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const watchmen = users.filter(
    (user) => user.role === "WATCHMAN"
  );

  const pendingIncidents = incidents.filter((incident) => {
  const status = incident.status?.toUpperCase();

  return (
    status !== "RESOLVED" &&
    status !== "CLOSED"
  );
});

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>Community</h2>
          <h2>Sentinel</h2>
        </div>

        <nav>

          <button className="active">
            🏠 Dashboard
          </button>

          <button onClick={() => navigate("/users")}>
            👥 Users
          </button>

          <button onClick={() => navigate("/incidents")}>
            🚨 Incidents
          </button>

          <button onClick={() => navigate("/watchmen")}>
            👮 Watchmen
          </button>
          <button onClick={() => navigate("/assignments")}>
            📌 Assignments
          </button>
          <button onClick={() => navigate("/reports")}>
            📊 Reports
          </button>
        </nav>

        <button
          className="logout-button"
          onClick={() => {
            sessionStorage.clear();
            navigate("/");
          }}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage your neighbourhood safely and efficiently.
            </p>
          </div>

          <div className="admin-profile">

            <div className="profile-icon">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        {/* WELCOME */}
        <section className="welcome-card">

          <div>
            <h2>Welcome, Admin 👋</h2>

            <p>
              Here's an overview of your neighbourhood watch system.
            </p>
          </div>

        </section>

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card blue">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <p>Total Users</p>
              <h2>
                {loading ? "..." : dashboard?.total_users ?? 0}
              </h2>
            </div>

          </div>

          <div className="stat-card red">

            <div className="stat-icon">
              🚨
            </div>

            <div>
              <p>Total Incidents</p>
              <h2>
                {loading ? "..." : dashboard?.total_incidents??0}
              </h2>
            </div>

          </div>

          <div className="stat-card green">

            <div className="stat-icon">
              👮
            </div>

            <div>
              <p>Watchmen</p>
              <h2>
                {loading ? "..." : watchmen.length}
              </h2>
            </div>

          </div>

          <div className="stat-card orange">

            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <p>Pending Incidents</p>
              <h2>
                {loading ? "..." : dashboard?.pending_incidents??0}
              </h2>
            </div>

          </div>

        </section>

        {/* RECENT INCIDENTS */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Incidents</h2>
            <button onClick={() => navigate("/incidents")}>
              View All
            </button>

          </div>

          <div className="incident-table">

            <div className="table-header">
              <span>Title</span>
              <span>Category</span>
              <span>Location</span>
              <span>Status</span>
            </div>

            {incidents.slice(0, 5).map((incident) => (

              <div
                className="table-row"
                key={incident.incident_id}
              >

                <span>
                  {incident.title}
                </span>

                <span>
                  {incident.category}
                </span>

                <span>
                  {incident.location}
                </span>

                <span className="status pending">
                  {incident.status}
                </span>

              </div>

            ))}

            {!loading && incidents.length === 0 && (
              <div className="table-row">
                <span>No incidents found</span>
              </div>
            )}

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-section">

          <h2>Quick Actions</h2>

          <div className="quick-actions">

            <button onClick={() => navigate("/users")}>
              <span>👥</span>
              Manage Users
            </button>

            <button onClick={() => navigate("/incidents")}>
              <span>🚨</span>
              View Incidents
            </button>

            <button onClick={() => navigate("/watchmen")}>
              <span>👮</span>
              View Watchmen
            </button>
            <button onClick={() => navigate("/reports")}>
              <span>📊</span>
              View Reports
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;