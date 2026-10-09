import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function Reports() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/incidents/list/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }

        const data = await response.json();

        setIncidents(
          Array.isArray(data)
            ? data
            : data.results || []
        );

      } catch (error) {
        console.error("Reports fetch error:", error);
        setError("Cannot connect to Django server");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "RESOLVED":
        return "resolved";

      case "CLOSED":
        return "closed";

      case "UNDER_INVESTIGATION":
        return "investigating";

      case "ASSIGNED":
        return "assigned";

      default:
        return "pending";
    }
  };

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>Community</h2>
          <h2>Sentinel</h2>
        </div>

        <nav>

          <button
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/users")
            }
          >
            👥 Users
          </button>

          <button
            onClick={() =>
              navigate("/incidents")
            }
          >
            🚨 Incidents
          </button>

          <button
            onClick={() =>
              navigate("/watchmen")
            }
          >
            👮 Watchmen
          </button>

          <button
            onClick={() =>
              navigate("/assignments")
            }
          >
            📌 Assignments
          </button>

          <button className="active">
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

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>Incident Progress Reports</h1>

            <p>
              Monitor incident status and investigation progress.
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

        {/* REPORTS SECTION */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Incident Progress</h2>

              <p>
                Track the current status and progress of
                reported incidents.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/admin-dashboard")
              }
            >
              Back to Dashboard
            </button>

          </div>

          {/* LOADING */}
          {loading && (
            <p>Loading reports...</p>
          )}

          {/* ERROR */}
          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            incidents.length === 0 && (
              <p>
                No incident reports available.
              </p>
            )}

          {/* REPORT TABLE */}
          {!loading &&
            !error &&
            incidents.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "1.5fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr",
                  }}
                >

                  <span>Incident</span>

                  <span>Category</span>

                  <span>Resident</span>

                  <span>Watchman</span>

                  <span>Status</span>

                  <span>Progress</span>

                </div>

                {/* TABLE ROWS */}
                {incidents.map((incident) => {

                  const progress =
                    incident.progress || 0;

                  return (

                    <div
                      className="table-row"
                      key={incident.id}
                      style={{
                        gridTemplateColumns:
                          "1.5fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr",
                      }}
                    >

                      {/* INCIDENT */}
                      <span>
                        <strong>
                          {incident.title}
                        </strong>
                      </span>

                      {/* CATEGORY */}
                      <span>
                        {incident.category}
                      </span>

                      {/* RESIDENT */}
                      <span>
                        {incident.resident}
                      </span>

                      {/* WATCHMAN */}
                      <span>
                        {incident.watchman ||
                          "Not Assigned"}
                      </span>

                      {/* STATUS */}
                      <span>
                        <span
                          className={`status ${getStatusClass(
                            incident.status
                          )}`}
                        >
                          {incident.status}
                        </span>
                      </span>

                      {/* PROGRESS */}
                      <span>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >

                          <div
                            style={{
                              width: "80px",
                              height: "8px",
                              background: "#e5e7eb",
                              borderRadius: "5px",
                              overflow: "hidden",
                            }}
                          >

                            <div
                              style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "#22c55e",
                                borderRadius: "5px",
                              }}
                            />

                          </div>

                          <span>
                            {progress}%
                          </span>

                        </div>

                      </span>

                    </div>

                  );
                })}

              </div>

            )}

        </section>

        {/* REPORT SUMMARY */}
        {!loading &&
          !error &&
          incidents.length > 0 && (

            <section className="dashboard-section">

              <h2>Report Summary</h2>

              <div className="quick-actions">

                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    🚨 Total Incidents
                  </h3>

                  <h2>
                    {incidents.length}
                  </h2>

                  <p>
                    Total incidents currently recorded.
                  </p>

                </div>

                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    🔍 Under Investigation
                  </h3>

                  <h2>
                    {
                      incidents.filter(
                        (incident) =>
                          incident.status ===
                          "UNDER_INVESTIGATION"
                      ).length
                    }
                  </h2>

                  <p>
                    Incidents currently being investigated.
                  </p>

                </div>

                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    ✅ Resolved
                  </h3>

                  <h2>
                    {
                      incidents.filter(
                        (incident) =>
                          incident.status ===
                          "RESOLVED"
                      ).length
                    }
                  </h2>

                  <p>
                    Incidents successfully resolved.
                  </p>

                </div>

                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    📁 Closed
                  </h3>

                  <h2>
                    {
                      incidents.filter(
                        (incident) =>
                          incident.status ===
                          "CLOSED"
                      ).length
                    }
                  </h2>

                  <p>
                    Incidents that have been closed.
                  </p>

                </div>

              </div>

            </section>

          )}

      </main>

    </div>
  );
}
export default Reports;
