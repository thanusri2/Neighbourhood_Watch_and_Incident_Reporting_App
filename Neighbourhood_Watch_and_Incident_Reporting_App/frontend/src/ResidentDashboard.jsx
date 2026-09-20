import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function ResidentDashboard() {
  const username =
    sessionStorage.getItem("username") || "Resident";
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/user/2/`
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !title ||
      !description ||
      !category ||
      !location
    ) {
      setMessage("Please fill all fields.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/incidents/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resident_id: 2,
            category_id: Number(category),
            title: title,
            description: description,
            location: location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create incident"
        );
      }

      setMessage(
        "Incident reported successfully!"
      );
      setMessageType("success");

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setShowForm(false);

    } catch (error) {
      console.error(
        "Incident creation error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to create incident."
      );

      setMessageType("error");
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

          <button
            onClick={() => {
              setShowForm(true);
              setMessage("");
            }}
          >
            🚨 Report Incident
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
            <h1>Resident Dashboard</h1>

            <p>
              Report incidents in your
              neighborhood.
            </p>
          </div>

          <div className="admin-profile">

            <div className="profile-icon">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{username}</strong>
              <span>Resident</span>
            </div>

          </div>

        </header>

        {/* WELCOME */}
        <section className="dashboard-section">

          <h2>
            Welcome, {username} 👋
          </h2>

          <p>
            Report any suspicious activity or
            incident in your neighborhood.
          </p>

          <button
            onClick={() => {
              setShowForm(true);
              setMessage("");
            }}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🚨 Report New Incident
          </button>

        </section>

        {/* ==============================
            NOTIFICATIONS
        ============================== */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>🔔 Notifications</h2>

              <p style={{ color: "#64748b" }}>
                Updates about your reported incidents.
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              style={{
                padding: "8px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔄 Refresh
            </button>

          </div>

          {notifications.length === 0 ? (

            <div
              className="table-row"
              style={{
                padding: "15px",
                color: "#64748b",
              }}
            >
              No notifications available.
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
                    gap: "20px",
                    marginBottom: "8px",
                    padding: "14px",
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
                      whiteSpace:
                        "nowrap",
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

        {/* INCIDENT FORM */}
        {showForm && (
          <section className="dashboard-section">

            <div className="section-header">

              <div>
                <h2>Report Incident</h2>

                <p>
                  Provide details about the
                  incident.
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* TITLE */}
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
                  Incident Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Example: Suspicious person near parking"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border:
                      "1px solid #d1d5db",
                  }}
                />

              </div>

              {/* DESCRIPTION */}
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
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe what happened..."
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border:
                      "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />

              </div>

              {/* CATEGORY */}
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
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border:
                      "1px solid #d1d5db",
                  }}
                >

                  <option value="">
                    -- Select Category --
                  </option>

                  <option value="1">
                    Suspicious Activity
                  </option>

                  <option value="7">
                    Theft
                  </option>

                  <option value="8">
                    Vandalism
                  </option>

                  <option value="9">
                    Fire
                  </option>

                  <option value="10">
                    Other
                  </option>

                </select>

              </div>

              {/* LOCATION */}
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
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder="Example: Block B - Parking Area"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border:
                      "1px solid #d1d5db",
                  }}
                />

              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >

                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  🚨 Submit Incident
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setMessage("");
                  }}
                  style={{
                    padding: "12px 20px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}

      </main>

    </div>
  );
}

export default ResidentDashboard;
