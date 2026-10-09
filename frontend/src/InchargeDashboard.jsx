import { useEffect, useState } from "react";
const API_BASE = "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function InchargeDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [watchmen, setWatchmen] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [selectedWatchman, setSelectedWatchman] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const username = sessionStorage.getItem("username");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incidentsResponse, usersResponse] = await Promise.all([
        fetch(`${API_BASE}/api/incidents/list/`),
        fetch(`${API_BASE}/api/users/list/`),
      ]);

      const incidentsData = await incidentsResponse.json();
      const usersData = await usersResponse.json();

      setIncidents(
        Array.isArray(incidentsData)
          ? incidentsData
          : incidentsData.results || []
      );

      const allUsers = Array.isArray(usersData)
        ? usersData
        : usersData.results || [];

      setWatchmen(
        allUsers.filter((user) => user.role === "WATCHMAN")
      );
    } catch (error) {
      console.error("Incharge dashboard error:", error);
      setMessage("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedIncident || !selectedWatchman) {
      alert("Please select an incident and watchman.");
      return;
    }

    try {
      const usersResponse = await fetch(
        `${API_BASE}/api/users/list/`
      );

      const usersData = await usersResponse.json();

      const allUsers = Array.isArray(usersData)
        ? usersData
        : usersData.results || [];

      const incharge = allUsers.find(
        (user) =>
          user.username === username &&
          user.role === "INCHARGE"
      );

      if (!incharge) {
        alert("Incharge user not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/incidents/assign/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident_id: Number(selectedIncident),
            watchman_id: Number(selectedWatchman),
            incharge_id: Number(incharge.id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Assignment failed.");
        return;
      }

      alert("Watchman assigned successfully.");

      setSelectedIncident("");
      setSelectedWatchman("");

      fetchData();
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Cannot connect to Django server.");
    }
  };

  if (loading) {
    return <div className="admin-main">Loading dashboard...</div>;
  }

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>Community</h2>
          <h2>Sentinel</h2>
        </div>

        <nav>
          <button className="active">
            🏠 Dashboard
          </button>

          <button onClick={() => window.location.href = "/"}>
            🚪 Logout
          </button>
        </nav>

      </aside>

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Incharge Dashboard</h1>

            <p>
              Manage incidents and assign watchmen for investigation.
            </p>
          </div>

          <div className="admin-profile">

            <div className="profile-icon">
              I
            </div>

            <div>
              <strong>{username || "Incharge"}</strong>
              <span>Security Incharge</span>
            </div>

          </div>

        </header>

        <section className="welcome-card">

          <div>
            <h2>Welcome, {username || "Incharge"} 👋</h2>

            <p>
              Review reported incidents and assign them to available watchmen.
            </p>
          </div>

        </section>

        <section className="stats-grid">

          <div className="stat-card blue">
            <div className="stat-icon">🚨</div>

            <div>
              <p>Total Incidents</p>
              <h2>{incidents.length}</h2>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">👮</div>

            <div>
              <p>Watchmen</p>
              <h2>{watchmen.length}</h2>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>

            <div>
              <p>Pending</p>
              <h2>
                {
                  incidents.filter(
                    (incident) =>
                      incident.status === "PENDING"
                  ).length
                }
              </h2>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">🔍</div>

            <div>
              <p>Investigation</p>
              <h2>
                {
                  incidents.filter(
                    (incident) =>
                      incident.status === "UNDER_INVESTIGATION"
                  ).length
                }
              </h2>
            </div>
          </div>

        </section>

        <section className="dashboard-section">

          <h2>Assign Incident</h2>

          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            Select an incident and assign it to a watchman.
          </p>

          {message && (
            <p style={{ color: "#dc2626", marginBottom: "15px" }}>
              {message}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "15px",
              alignItems: "end",
            }}
          >

            <div className="input-group">

              <label>Incident</label>

              <select
                value={selectedIncident}
                onChange={(e) =>
                  setSelectedIncident(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >

                <option value="">
                  Select Incident
                </option>

                {incidents
                  .filter(
                    (incident) =>
                      incident.status !== "RESOLVED" &&
                      incident.status !== "CLOSED"
                  )
                  .map((incident) => (
                    <option
                      key={incident.id}
                      value={incident.id}
                    >
                      #{incident.id} - {incident.title}
                    </option>
                  ))}

              </select>

            </div>

            <div className="input-group">

              <label>Watchman</label>

              <select
                value={selectedWatchman}
                onChange={(e) =>
                  setSelectedWatchman(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >

                <option value="">
                  Select Watchman
                </option>

                {watchmen.map((watchman) => (
                  <option
                    key={watchman.id}
                    value={watchman.id}
                  >
                    {watchman.username}
                  </option>
                ))}

              </select>

            </div>

            <button
              onClick={handleAssign}
              className="login-button"
              style={{
                width: "auto",
                padding: "13px 25px",
              }}
            >
              Assign
            </button>

          </div>

        </section>

        <section className="dashboard-section">

          <h2>Incident Overview</h2>

          <div className="incident-table">

            <div className="table-header">

              <span>ID</span>
              <span>Title</span>
              <span>Category</span>
              <span>Watchman</span>
              <span>Status</span>

            </div>

            {incidents.map((incident) => (

              <div
                className="table-row"
                key={incident.id}
              >

                <span>#{incident.id}</span>

                <span>{incident.title}</span>

                <span>{incident.category}</span>

                <span>
                  {incident.watchman || "Not Assigned"}
                </span>

                <span>
                  <span className="status pending">
                    {incident.status}
                  </span>
                </span>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}
export default InchargeDashboard;
