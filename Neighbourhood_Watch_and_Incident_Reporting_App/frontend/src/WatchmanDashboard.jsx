import { useEffect, useState } from "react";
const API_BASE = "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function WatchmanDashboard() {
  const username = sessionStorage.getItem("username");

  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/user/${userId}/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );
    }
  };

  // FETCH ASSIGNED INCIDENTS
  const fetchAssignedIncidents = async () => {
    try {
      setLoading(true);

      const usersResponse = await fetch(
        `${API_BASE}/api/users/list/`
      );

      const usersData = await usersResponse.json();

      const users = Array.isArray(usersData)
        ? usersData
        : usersData.results || [];

      const watchman = users.find(
        (user) =>
          user.username === username &&
          user.role === "WATCHMAN"
      );

      if (!watchman) {
        console.error("Watchman not found");
        return;
      }

      // Fetch notifications
      await fetchNotifications(watchman.id);

      const incidentsResponse = await fetch(
        `${API_BASE}/api/incidents/watchman/${watchman.id}/`
      );

      if (!incidentsResponse.ok) {
        throw new Error(
          "Failed to fetch assigned incidents"
        );
      }

      const incidentsData =
        await incidentsResponse.json();

      const assignedIncidents =
        Array.isArray(incidentsData)
          ? incidentsData
          : incidentsData.results || [];

      // Remove duplicate incidents
      const uniqueIncidents = Array.from(
        new Map(
          assignedIncidents.map((incident) => [
            incident.incident_id,
            incident,
          ])
        ).values()
      );

      setIncidents(uniqueIncidents);

    } catch (error) {
      console.error(
        "Watchman dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedIncidents();
  }, [username]);


  // UPDATE PROGRESS
  const handleProgressUpdate = async (
    incident,
    newProgress
  ) => {
    const progressValue = Number(newProgress);

    // Do not update resolved incidents
    if (incident.status === "RESOLVED") {
      return;
    }

    let newStatus = "ASSIGNED";

    if (
      progressValue > 0 &&
      progressValue < 100
    ) {
      newStatus = "UNDER_INVESTIGATION";
    }

    if (progressValue === 100) {
      newStatus = "RESOLVED";
    }

    try {
      setUpdatingId(incident.incident_id);
      setMessage("");
      setMessageType("");

      const response = await fetch(
        `${API_BASE}/api/incidents/update-progress/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident_id:
              incident.incident_id,
            progress: progressValue,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update progress"
        );
      }

      setMessage(
        `Incident updated successfully — ${progressValue}%`
      );

      setMessageType("success");

      await fetchAssignedIncidents();

    } catch (error) {
      console.error(
        "Progress update error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to update progress."
      );

      setMessageType("error");

    } finally {
      setUpdatingId(null);
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
          <button className="active">
            🏠 Dashboard
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
            <h1>Watchman Dashboard</h1>

            <p>
              View and manage your assigned incidents.
            </p>
          </div>

          <div className="admin-profile">

            <div className="profile-icon">
              W
            </div>

            <div>
              <strong>
                {username || "Watchman"}
              </strong>

              <span>
                Security Watchman
              </span>
            </div>

          </div>

        </header>


        {/* WELCOME */}

        <section className="welcome-card">

          <div>

            <h2>
              Welcome, {username || "Watchman"} 👋
            </h2>

            <p>
              Review your assigned incidents and
              update their progress.
            </p>

          </div>

        </section>


        {/* MESSAGE */}

        {message && (

          <section className="dashboard-section">

            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background:
                  messageType === "success"
                    ? "#dcfce7"
                    : "#fee2e2",
                color:
                  messageType === "success"
                    ? "#166534"
                    : "#991b1b",
                border:
                  messageType === "success"
                    ? "1px solid #86efac"
                    : "1px solid #fca5a5",
              }}
            >
              {message}
            </div>

          </section>

        )}


        {/* NOTIFICATIONS */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>🔔 Notifications</h2>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Your latest notifications.
              </p>

            </div>

          </div>


          {notifications.length === 0 ? (

            <div className="table-row">

              <span>
                No notifications available.
              </span>

            </div>

          ) : (

            notifications.map(
              (notification) => (

                <div
                  key={
                    notification.notification_id
                  }
                  className="table-row"
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >

                  <span>

                    {notification.is_read
                      ? "✓"
                      : "🔵"}{" "}

                    {notification.message}

                  </span>

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >

                    {new Date(
                      notification.created_at
                    ).toLocaleString()}

                  </span>

                </div>

              )
            )

          )}

        </section>


        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card blue">

            <div className="stat-icon">
              📋
            </div>

            <div>

              <p>
                Assigned Incidents
              </p>

              <h2>
                {loading
                  ? "..."
                  : incidents.length}
              </h2>

            </div>

          </div>


          <div className="stat-card orange">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <p>Pending</p>

              <h2>
                {loading
                  ? "..."
                  : incidents.filter(
                      (incident) =>
                        incident.status ===
                        "ASSIGNED"
                    ).length}
              </h2>

            </div>

          </div>


          <div className="stat-card red">

            <div className="stat-icon">
              🔍
            </div>

            <div>

              <p>Investigation</p>

              <h2>
                {loading
                  ? "..."
                  : incidents.filter(
                      (incident) =>
                        incident.status ===
                        "UNDER_INVESTIGATION"
                    ).length}
              </h2>

            </div>

          </div>


          <div className="stat-card green">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <p>Resolved</p>

              <h2>
                {loading
                  ? "..."
                  : incidents.filter(
                      (incident) =>
                        incident.status ===
                        "RESOLVED"
                    ).length}
              </h2>

            </div>

          </div>

        </section>


        {/* INCIDENT TABLE */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                My Assigned Incidents
              </h2>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Incidents assigned to you by the
                security incharge.
              </p>

            </div>

          </div>


          {loading && (

            <div className="table-row">

              <span>
                Loading assigned incidents...
              </span>

            </div>

          )}


          {!loading &&
            incidents.length === 0 && (

              <div className="table-row">

                <span>
                  No incidents assigned to you.
                </span>

              </div>

            )}


          {!loading &&
            incidents.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}

                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "0.5fr 2fr 1.2fr 1.5fr 1.3fr 1.5fr",
                  }}
                >

                  <span>ID</span>

                  <span>Incident</span>

                  <span>Category</span>

                  <span>Location</span>

                  <span>Status</span>

                  <span>Progress</span>

                </div>


                {/* TABLE ROWS */}

                {incidents.map(
                  (incident) => (

                    <div
                      className="table-row"
                      key={
                        incident.incident_id
                      }
                      style={{
                        gridTemplateColumns:
                          "0.5fr 2fr 1.2fr 1.5fr 1.3fr 1.5fr",
                      }}
                    >

                      {/* ID */}

                      <span>
                        #
                        {
                          incident.incident_id
                        }
                      </span>


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


                      {/* LOCATION */}

                      <span>
                        {incident.location ||
                          "Not specified"}
                      </span>


                      {/* STATUS */}

                      <span>

                        <span
                          className={`status ${
                            incident.status ===
                            "RESOLVED"
                              ? "resolved"
                              : incident.status ===
                                "UNDER_INVESTIGATION"
                              ? "investigation"
                              : "pending"
                          }`}
                        >

                          {incident.status}

                        </span>

                      </span>


                      {/* PROGRESS */}

                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >

                        <select
                          value={
                            incident.progress ??
                            0
                          }
                          disabled={
                            incident.status ===
                              "RESOLVED" ||
                            updatingId ===
                              incident.incident_id
                          }
                          onChange={(e) =>
                            handleProgressUpdate(
                              incident,
                              e.target.value
                            )
                          }
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border:
                              "1px solid #d1d5db",
                            background:
                              incident.status ===
                              "RESOLVED"
                                ? "#f1f5f9"
                                : "white",
                            cursor:
                              incident.status ===
                              "RESOLVED"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >

                          <option value="0">
                            0%
                          </option>

                          <option value="25">
                            25%
                          </option>

                          <option value="50">
                            50%
                          </option>

                          <option value="75">
                            75%
                          </option>

                          <option value="100">
                            100%
                          </option>

                        </select>


                        {updatingId ===
                          incident.incident_id && (

                          <span>
                            Updating...
                          </span>

                        )}

                      </span>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default WatchmanDashboard;

