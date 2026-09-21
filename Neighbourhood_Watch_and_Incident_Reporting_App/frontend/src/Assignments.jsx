import { useEffect, useState } from "react";

const API_BASE = "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [watchmen, setWatchmen] = useState([]);
  const [incharges, setIncharges] = useState([]);

  const [selectedIncident, setSelectedIncident] = useState("");
  const [selectedWatchman, setSelectedWatchman] = useState("");
  const [selectedIncharge, setSelectedIncharge] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [incidentsResponse, usersResponse] =
        await Promise.all([
          fetch(`${API_BASE}/api/incidents/list/`),
          fetch(`${API_BASE}/api/users/list/`),
        ]);

      if (!incidentsResponse.ok) {
        throw new Error("Failed to fetch incidents");
      }

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const incidentsData =
        await incidentsResponse.json();

      const usersData =
        await usersResponse.json();

      const incidentsList = Array.isArray(incidentsData)
        ? incidentsData
        : incidentsData.results || [];

      const usersList = Array.isArray(usersData)
        ? usersData
        : usersData.results || [];

      setAssignments(incidentsList);

      setWatchmen(
        usersList.filter(
          (user) => user.role === "WATCHMAN"
        )
      );

      setIncharges(
        usersList.filter(
          (user) => user.role === "INCHARGE"
        )
      );

    } catch (error) {
      console.error("Assignment fetch error:", error);

      setMessage(
        "Failed to load assignment data."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableIncidents = assignments.filter(
    (incident) =>
      incident.status !== "RESOLVED" &&
      incident.status !== "CLOSED" &&
      !incident.watchman
  );

  const handleAssign = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !selectedIncident ||
      !selectedWatchman ||
      !selectedIncharge
    ) {
      setMessage(
        "Please select Incident, Watchman and Incharge."
      );

      setMessageType("error");

      return;
    }

    const incident = assignments.find(
      (item) =>
        String(item.id) ===
        String(selectedIncident)
    );

    if (
      incident?.watchman ||
      incident?.status === "RESOLVED" ||
      incident?.status === "CLOSED"
    ) {
      setMessage(
        "This incident is already assigned or completed."
      );

      setMessageType("error");

      return;
    }

    try {
      setAssigning(true);

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
            incharge_id: Number(selectedIncharge),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to assign watchman"
        );
      }

      setMessage(
        `Incident #${data.incident_id} assigned successfully to ${data.watchman}.`
      );

      setMessageType("success");

      setSelectedIncident("");
      setSelectedWatchman("");
      setSelectedIncharge("");

      await fetchData();

    } catch (error) {
      console.error(
        "Assignment error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to assign watchman."
      );

      setMessageType("error");

    } finally {
      setAssigning(false);
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
              window.location.href =
                "/admin-dashboard"
            }
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() =>
              window.location.href = "/users"
            }
          >
            👥 Users
          </button>

          <button
            onClick={() =>
              window.location.href =
                "/incidents"
            }
          >
            🚨 Incidents
          </button>

          <button
            onClick={() =>
              window.location.href =
                "/watchmen"
            }
          >
            👮 Watchmen
          </button>

          <button className="active">
            📌 Assignments
          </button>

          <button
            onClick={() =>
              window.location.href =
                "/reports"
            }
          >
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

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>Assignments</h1>

            <p>
              Manage incident assignments and
              monitor watchman progress.
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

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Assign Watchman</h2>

              <p>
                Assign an active incident to a
                watchman through an incharge.
              </p>
            </div>

          </div>

          {/* MESSAGE */}

          {message && (
            <div
              style={{
                padding: "12px 16px",
                marginBottom: "20px",
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
                fontWeight: "500",
              }}
            >
              {message}
            </div>
          )}

          {/* ASSIGN FORM */}

          <form onSubmit={handleAssign}>

            {/* INCIDENT */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Select Incident
              </label>

              <select
                value={selectedIncident}
                onChange={(e) =>
                  setSelectedIncident(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border:
                    "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              >

                <option value="">
                  -- Select Incident --
                </option>

                {availableIncidents.map(
                  (incident) => (
                    <option
                      key={incident.id}
                      value={incident.id}
                    >
                      #{incident.id} -{" "}
                      {incident.title} (
                      {incident.status})
                    </option>
                  )
                )}

              </select>

              {availableIncidents.length ===
                0 && (
                <p
                  style={{
                    marginTop: "8px",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  No active unassigned
                  incidents available.
                </p>
              )}

            </div>

            {/* WATCHMAN */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Select Watchman
              </label>

              <select
                value={selectedWatchman}
                onChange={(e) =>
                  setSelectedWatchman(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border:
                    "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              >

                <option value="">
                  -- Select Watchman --
                </option>

                {watchmen.map(
                  (watchman) => (
                    <option
                      key={watchman.id}
                      value={watchman.id}
                    >
                      {watchman.username}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* INCHARGE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Select Incharge
              </label>

              <select
                value={selectedIncharge}
                onChange={(e) =>
                  setSelectedIncharge(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border:
                    "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              >

                <option value="">
                  -- Select Incharge --
                </option>

                {incharges.map(
                  (incharge) => (
                    <option
                      key={incharge.id}
                      value={incharge.id}
                    >
                      {incharge.username}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={
                assigning ||
                availableIncidents.length === 0
              }
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "8px",
                background:
                  assigning ||
                  availableIncidents.length === 0
                    ? "#9ca3af"
                    : "#2563eb",
                color: "#ffffff",
                fontWeight: "600",
                cursor:
                  assigning ||
                  availableIncidents.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {assigning
                ? "Assigning..."
                : "📌 Assign Watchman"}
            </button>

          </form>

        </section>

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Incident Assignments</h2>

              <p>
                View assigned watchmen and
                incident progress.
              </p>
            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="table-row">
              <span>
                Loading assignments...
              </span>
            </div>
          )}

          {/* NO DATA */}

          {!loading &&
            assignments.length === 0 && (
              <div className="table-row">
                <span>
                  No assignments found.
                </span>
              </div>
            )}

          {/* TABLE */}

          {!loading &&
            assignments.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}

                <div className="table-header">

                  <span>ID</span>

                  <span>Incident</span>

                  <span>Category</span>

                  <span>Resident</span>

                  <span>Watchman</span>

                  <span>Status</span>

                  <span>Progress</span>

                </div>

                {/* TABLE ROWS */}

                {assignments.map(
                  (assignment) => (

                    <div
                      className="table-row"
                      key={assignment.id}
                    >

                      <span>
                        #{assignment.id}
                      </span>

                      <span>
                        <strong>
                          {assignment.title}
                        </strong>
                      </span>

                      <span>
                        {assignment.category}
                      </span>

                      <span>
                        {assignment.resident}
                      </span>

                      <span>
                        {assignment.watchman ||
                          "Not Assigned"}
                      </span>

                      <span>

                        <span
                          className={`status ${
                            assignment.status ===
                            "RESOLVED"
                              ? "resolved"
                              : assignment.status ===
                                "CLOSED"
                              ? "closed"
                              : assignment.status ===
                                "UNDER_INVESTIGATION"
                              ? "investigating"
                              : "pending"
                          }`}
                        >
                          {assignment.status}
                        </span>

                      </span>

                      <span>

                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                          }}
                        >

                          <div
                            style={{
                              width: "80px",
                              height: "8px",
                              background:
                                "#e5e7eb",
                              borderRadius:
                                "5px",
                              overflow:
                                "hidden",
                            }}
                          >

                            <div
                              style={{
                                width: `${assignment.progress}%`,
                                height: "100%",
                                background:
                                  "#22c55e",
                                borderRadius:
                                  "5px",
                              }}
                            />

                          </div>

                          <span>
                            {assignment.progress}%
                          </span>

                        </div>

                      </span>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

        {/* ========================= */}
        {/* ASSIGNMENT DETAILS */}
        {/* ========================= */}

        {!loading &&
          assignments.length > 0 && (

            <section className="dashboard-section">

              <h2>Assignment Details</h2>

              <div className="quick-actions">

                {assignments.map(
                  (assignment) => (

                    <div
                      key={assignment.id}
                      style={{
                        padding: "20px",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "12px",
                        background:
                          "#ffffff",
                      }}
                    >

                      <h3>
                        {assignment.title}
                      </h3>

                      <p>
                        <strong>
                          Incident ID:
                        </strong>{" "}
                        #{assignment.id}
                      </p>

                      <p>
                        <strong>
                          Description:
                        </strong>{" "}
                        {assignment.description ||
                          "No description available"}
                      </p>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {assignment.category}
                      </p>

                      <p>
                        <strong>
                          Reported By:
                        </strong>{" "}
                        {assignment.resident}
                      </p>

                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {assignment.location ||
                          "Not specified"}
                      </p>

                      <p>
                        <strong>
                          Assigned Watchman:
                        </strong>{" "}
                        {assignment.watchman ||
                          "Not assigned"}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {assignment.status}
                      </p>

                      <p>
                        <strong>
                          Progress:
                        </strong>{" "}
                        {assignment.progress}%
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

      </main>

    </div>
  );
}

export default Assignments;
