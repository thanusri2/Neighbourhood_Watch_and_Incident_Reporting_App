import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:1573";

function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [incidentsResponse, usersResponse] = await Promise.all([
          fetch(`${API_BASE}/api/incidents/list/`),
          fetch(`${API_BASE}/api/users/list/`),
        ]);

        if (!incidentsResponse.ok) {
          throw new Error("Failed to fetch incidents");
        }

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        const incidentsData = await incidentsResponse.json();
        const usersData = await usersResponse.json();

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

  const pendingIncidents = incidents.filter(
    (incident) =>
      incident.status !== "RESOLVED" &&
      incident.status !== "CLOSED"
  );

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

          <button
            onClick={() => {
              window.location.href = "/users";
            }}
          >
            👥 Users
          </button>

          <button
            onClick={() => {
              window.location.href = "/incidents";
            }}
          >
            🚨 Incidents
          </button>

          <button
            onClick={() => {
              window.location.href = "/watchmen";
            }}
          >
            👮 Watchmen
          </button>

          <button>
            📌 Assignments
          </button>

          <button>
            📊 Reports
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/";
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
                {loading ? "..." : users.length}
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
                {loading ? "..." : incidents.length}
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
                {loading ? "..." : pendingIncidents.length}
              </h2>
            </div>

          </div>

        </section>

        {/* RECENT INCIDENTS */}
        <section className="dashboard-section">

          <div className="section-header">

            <h2>Recent Incidents</h2>

            <button
              onClick={() => {
                window.location.href = "/incidents";
              }}
            >
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
                key={incident.id}
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

            <button
              onClick={() => {
                window.location.href = "/users";
              }}
            >
              <span>👥</span>
              Manage Users
            </button>

            <button
              onClick={() => {
                window.location.href = "/incidents";
              }}
            >
              <span>🚨</span>
              View Incidents
            </button>

            <button
              onClick={() => {
                window.location.href = "/watchmen";
              }}
            >
              <span>👮</span>
              View Watchmen
            </button>

            <button>
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