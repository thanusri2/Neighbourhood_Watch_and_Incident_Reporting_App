import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Watchmen() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, incidentsResponse] =
          await Promise.all([
            fetch(
              "https://neighbourhood-watch-and-incident-h09c.onrender.com/api/users/list/"
            ),
            fetch(
              "https://neighbourhood-watch-and-incident-h09c.onrender.com/api/incidents/list/"
            ),
          ]);

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        if (!incidentsResponse.ok) {
          throw new Error("Failed to fetch incidents");
        }

        const usersData = await usersResponse.json();
        const incidentsData = await incidentsResponse.json();

        setUsers(
          Array.isArray(usersData)
            ? usersData
            : usersData.results || []
        );

        setIncidents(
          Array.isArray(incidentsData)
            ? incidentsData
            : incidentsData.results || []
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Cannot connect to Django server");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const watchmen = users.filter(
    (user) => user.role === "WATCHMAN"
  );

  const getAssignedCount = (username) => {
    return incidents.filter(
      (incident) => incident.watchman === username
    ).length;
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

          <button className="active">
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
            <h1>Watchmen</h1>

            <p>
              Manage neighbourhood watchmen and
              monitor their assigned incidents.
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

        {/* WATCHMEN SECTION */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>All Watchmen</h2>

              <p>
                View watchman details and assignment status.
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
            <p>Loading watchmen...</p>
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
            watchmen.length === 0 && (
              <p>No watchmen found.</p>
            )}

          {/* WATCHMEN TABLE */}
          {!loading &&
            !error &&
            watchmen.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "0.6fr 1.2fr 1.5fr 1.2fr 1fr 1fr",
                  }}
                >

                  <span>ID</span>

                  <span>Username</span>

                  <span>Email</span>

                  <span>Phone</span>

                  <span>Incidents</span>

                  <span>Status</span>

                </div>

                {/* TABLE ROWS */}
                {watchmen.map((watchman) => {

                  const assignedCount =
                    getAssignedCount(
                      watchman.username
                    );

                  return (

                    <div
                      className="table-row"
                      key={watchman.id}
                      style={{
                        gridTemplateColumns:
                          "0.6fr 1.2fr 1.5fr 1.2fr 1fr 1fr",
                      }}
                    >

                      {/* ID */}
                      <span>
                        #{watchman.id}
                      </span>

                      {/* USERNAME */}
                      <span>
                        <strong>
                          {watchman.username}
                        </strong>
                      </span>

                      {/* EMAIL */}
                      <span>
                        {watchman.email || "---"}
                      </span>

                      {/* PHONE */}
                      <span>
                        {watchman.phone || "---"}
                      </span>

                      {/* INCIDENT COUNT */}
                      <span>
                        {assignedCount}
                      </span>

                      {/* STATUS */}
                      <span
                        className={
                          watchman.is_active
                            ? "status resolved"
                            : "status pending"
                        }
                      >
                        {watchman.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                  );
                })}

              </div>

            )}

        </section>

        {/* WATCHMAN SUMMARY */}
        {!loading &&
          !error &&
          watchmen.length > 0 && (

            <section className="dashboard-section">

              <h2>Watchman Summary</h2>

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
                    👮 Total Watchmen
                  </h3>

                  <h2>
                    {watchmen.length}
                  </h2>

                  <p>
                    Registered watchmen in the system.
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
                    🟢 Active Watchmen
                  </h3>

                  <h2>
                    {
                      watchmen.filter(
                        (watchman) =>
                          watchman.is_active
                      ).length
                    }
                  </h2>

                  <p>
                    Currently active watchmen.
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
                    📌 Assigned Incidents
                  </h3>

                  <h2>
                    {
                      incidents.filter(
                        (incident) =>
                          incident.watchman
                      ).length
                    }
                  </h2>

                  <p>
                    Incidents currently linked to watchmen.
                  </p>
                </div>

              </div>

            </section>

          )}

      </main>

    </div>
  );
}

export default Watchmen;
