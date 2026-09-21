import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUser, setUpdatingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://neighbourhood-watch-and-incident-h09c.onrender.com/api/users/list/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(
        Array.isArray(data)
          ? data
          : data.results || []
      );

      setError("");
    } catch (error) {
      console.error(error);
      setError("Cannot connect to Django server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (user) => {
    try {
      setUpdatingUser(user.id);

      const response = await fetch(
        "https://neighbourhood-watch-and-incident-h09c.onrender.com/api/users/update-status/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            is_active: !user.is_active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update user status"
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                is_active: data.is_active,
              }
            : currentUser
        )
      );

    } catch (error) {
      console.error(error);
      alert("Failed to update user status");
    } finally {
      setUpdatingUser(null);
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

          <button className="active">
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

          <button
            onClick={() =>
              navigate("/reports")
            }
          >
            📊 Reports
          </button>

        </nav>

        {/* LOGOUT */}
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
            <h1>Users</h1>

            <p>
              Manage neighbourhood users and their
              account status.
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

        {/* USERS SECTION */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>All Users</h2>

              <p>
                View user details and manage account status.
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
            <p>
              Loading users...
            </p>
          )}

          {/* ERROR */}
          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* NO USERS */}
          {!loading &&
            !error &&
            users.length === 0 && (
              <p>
                No users found.
              </p>
            )}

          {/* USERS TABLE */}
          {!loading &&
            !error &&
            users.length > 0 && (

              <div className="incident-table">

                {/* TABLE HEADER */}
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "0.5fr 1.1fr 1.5fr 1.2fr 1fr 1.3fr",
                  }}
                >

                  <span>
                    ID
                  </span>

                  <span>
                    Username
                  </span>

                  <span>
                    Email
                  </span>

                  <span>
                    Phone
                  </span>

                  <span>
                    Role
                  </span>

                  <span>
                    Status
                  </span>

                </div>

                {/* TABLE ROWS */}
                {users.map((user) => (

                  <div
                    className="table-row"
                    key={user.id}
                    style={{
                      gridTemplateColumns:
                        "0.5fr 1.1fr 1.5fr 1.2fr 1fr 1.3fr",
                    }}
                  >

                    {/* ID */}
                    <span>
                      #{user.id}
                    </span>

                    {/* USERNAME */}
                    <span>
                      <strong>
                        {user.username || "---"}
                      </strong>
                    </span>

                    {/* EMAIL */}
                    <span>
                      {user.email || "---"}
                    </span>

                    {/* PHONE */}
                    <span>
                      {user.phone || "---"}
                    </span>

                    {/* ROLE */}
                    <span>
                      {user.role || "---"}
                    </span>

                    {/* STATUS + ACTION */}
                    <span>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >

                        <span
                          className={
                            user.is_active
                              ? "status resolved"
                              : "status pending"
                          }
                        >
                          {user.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <button
                          onClick={() =>
                            updateUserStatus(user)
                          }
                          disabled={
                            updatingUser === user.id
                          }
                          style={{
                            padding: "6px 10px",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                              updatingUser === user.id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {updatingUser === user.id
                            ? "Updating..."
                            : user.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                      </div>

                    </span>

                  </div>

                ))}

              </div>

            )}

        </section>

        {/* USER SUMMARY */}
        {!loading &&
          !error &&
          users.length > 0 && (

            <section className="dashboard-section">

              <h2>User Summary</h2>

              <div className="quick-actions">

                {/* TOTAL USERS */}
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    👥 Total Users
                  </h3>

                  <h2>
                    {users.length}
                  </h2>

                  <p>
                    Total registered users.
                  </p>

                </div>

                {/* ACTIVE USERS */}
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    🟢 Active Users
                  </h3>

                  <h2>
                    {
                      users.filter(
                        (user) => user.is_active
                      ).length
                    }
                  </h2>

                  <p>
                    Users with active accounts.
                  </p>

                </div>

                {/* RESIDENTS */}
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    🏠 Residents
                  </h3>

                  <h2>
                    {
                      users.filter(
                        (user) =>
                          user.role === "RESIDENT"
                      ).length
                    }
                  </h2>

                  <p>
                    Registered residents.
                  </p>

                </div>

                {/* WATCHMEN */}
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >

                  <h3>
                    👮 Watchmen
                  </h3>

                  <h2>
                    {
                      users.filter(
                        (user) =>
                          user.role === "WATCHMAN"
                      ).length
                    }
                  </h2>

                  <p>
                    Registered watchmen.
                  </p>

                </div>

              </div>

            </section>

          )}

      </main>

    </div>
  );
}
export default Users;