import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/incidents/list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }

        return response.json();
      })
      .then((data) => {
        setIncidents(
          Array.isArray(data)
            ? data
            : data.results || []
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Cannot connect to Django server");
        setLoading(false);
      });
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

          <button className="active">
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

          <button
            onClick={() =>
              navigate("/reports")
            }
          >
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
            <h1>Incidents</h1>

            <p>
              View and manage reported incidents.
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

        {/* INCIDENTS SECTION */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>All Incidents</h2>

              <p>
                Monitor reported incidents and their
                investigation progress.
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
            <p>Loading incidents...</p>
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
              <p>No incidents found.</p>
            )}

          {/* INCIDENT TABLE */}
          {!loading &&
            !error &&
            incidents.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "1.4fr 1.1fr 1fr 1.2fr 1.2fr 1fr 1fr 1.2fr",
                  }}
                >

                  <span>Title</span>

                  <span>Category</span>

                  <span>Resident</span>

                  <span>Location</span>

                  <span>Watchman</span>

                  <span>Status</span>

                  <span>Progress</span>

                  <span>Reported Date</span>

                </div>

                {/* TABLE ROWS */}
                {incidents.map((incident) => (

                  <div
                    className="table-row"
                    key={incident.id}
                    style={{
                      gridTemplateColumns:
                        "1.4fr 1.1fr 1fr 1.2fr 1.2fr 1fr 1fr 1.2fr",
                    }}
                  >

                    {/* TITLE */}
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

                    {/* LOCATION */}
                    <span>
                      {incident.location ||
                        "Not specified"}
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
                            width: "70px",
                            height: "8px",
                            background: "#e5e7eb",
                            borderRadius: "5px",
                            overflow: "hidden",
                          }}
                        >

                          <div
                            style={{
                              width: `${incident.progress || 0}%`,
                              height: "100%",
                              background: "#22c55e",
                              borderRadius: "5px",
                            }}
                          />

                        </div>

                        <span>
                          {incident.progress || 0}%
                        </span>

                      </div>

                    </span>

                    {/* REPORTED DATE */}
                    <span>
                      {incident.reported_date
                        ? new Date(
                            incident.reported_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>

                  </div>

                ))}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}
export default Incidents;