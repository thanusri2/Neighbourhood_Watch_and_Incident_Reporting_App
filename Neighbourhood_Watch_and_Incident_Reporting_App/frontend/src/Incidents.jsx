import { useEffect, useState } from "react";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:1573/api/incidents/list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }

        return response.json();
      })
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Cannot connect to Django server");
        setLoading(false);
      });
  }, []);

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
            onClick={() => {
              window.location.href = "/admin-dashboard";
            }}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => {
              window.location.href = "/users";
            }}
          >
            👥 Users
          </button>

          <button className="active">
            🚨 Incidents
          </button>

          <button>
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
            window.location.href = "/";
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
            <p>View and manage reported incidents.</p>
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
            </div>

            <button
              onClick={() => {
                window.location.href = "/admin-dashboard";
              }}
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

          {/* INCIDENT DATA */}
          {!loading &&
            !error &&
            incidents.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "1.5fr 1.2fr 1fr 1.5fr 1fr 1.2fr",
                  }}
                >
                  <span>Title</span>
                  <span>Category</span>
                  <span>Resident</span>
                  <span>Location</span>
                  <span>Status</span>
                  <span>Reported Date</span>
                </div>

                {/* TABLE ROWS */}
                {incidents.map((incident) => (

                  <div
                    className="table-row"
                    key={incident.id}
                    style={{
                      gridTemplateColumns:
                        "1.5fr 1.2fr 1fr 1.5fr 1fr 1.2fr",
                    }}
                  >

                    <span>
                      {incident.title}
                    </span>

                    <span>
                      {incident.category}
                    </span>

                    <span>
                      {incident.resident}
                    </span>

                    <span>
                      {incident.location}
                    </span>

                    <span
                      className={`status ${
                        incident.status === "RESOLVED"
                          ? "resolved"
                          : "pending"
                      }`}
                    >
                      {incident.status}
                    </span>

                    <span>
                      {new Date(
                        incident.reported_date
                      ).toLocaleDateString()}
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