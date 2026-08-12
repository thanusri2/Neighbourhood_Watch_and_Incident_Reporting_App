import { useEffect, useState } from "react";

function Watchmen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:1573/api/users/list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Cannot connect to Django server");
        setLoading(false);
      });
  }, []);

  const watchmen = users.filter(
    (user) => user.role === "WATCHMAN"
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

          <button
            onClick={() => {
              window.location.href = "/incidents";
            }}
          >
            🚨 Incidents
          </button>

          <button className="active">
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
            <h1>Watchmen</h1>

            <p>
              Manage neighbourhood watchmen.
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

            <h2>All Watchmen</h2>

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

                {/* HEADER */}
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "1fr 1.5fr 1.5fr 1fr",
                  }}
                >
                  <span>Username</span>
                  <span>Email</span>
                  <span>Phone</span>
                  <span>Status</span>
                </div>

                {/* ROWS */}
                {watchmen.map((watchman) => (

                  <div
                    className="table-row"
                    key={watchman.id}
                    style={{
                      gridTemplateColumns:
                        "1fr 1.5fr 1.5fr 1fr",
                    }}
                  >

                    <span>
                      {watchman.username}
                    </span>

                    <span>
                      {watchman.email || "---"}
                    </span>

                    <span>
                      {watchman.phone || "---"}
                    </span>

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

                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default Watchmen;