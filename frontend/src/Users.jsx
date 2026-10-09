import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUser, setUpdatingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({username: "",password: "",email: "",phone: "",role: "RESIDENT",badge_number: "",shift: "",});

  const fetchUsers = async () => {
    try {
      setLoading(true);

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
      alert(error.message || "Failed to update user status");
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const createUser = async () => {
    if (
      !newUser.username ||
      !newUser.password ||
      !newUser.email
    ) {
      alert("Please fill Username, Password and Email.");
      return;
    }

    try {
      setCreatingUser(true);

      const response = await fetch(
        "https://neighbourhood-watch-and-incident-h09c.onrender.com/api/users/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create user"
        );
      }

      alert("User created successfully!");

      setNewUser({username: "",password: "",email: "",phone: "",role: "RESIDENT",badge_number: "",shift: "",});
      setShowAddUser(false);

      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-page">

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
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>
            <h1>Users</h1>

            <p>
              Manage neighbourhood users and
              their account status.
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
              <h2>All Users</h2>

              <p>
                View user details and manage
                account status.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                onClick={() =>
                  setShowAddUser(!showAddUser)
                }
              >
                ➕ Add User
              </button>

              <button
                onClick={() =>
                  navigate("/admin-dashboard")
                }
              >
                Back to Dashboard
              </button>

            </div>

          </div>

          {showAddUser && (

            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#ffffff",
              }}
            >

              <h2>
                Create New User
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >

                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={handleInputChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleInputChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                />

                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="RESIDENT">
                    Resident
                  </option>

                  <option value="WATCHMAN">
                    Watchman
                  </option>

                  <option value="INCHARGE">
                    Incharge
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>
                {newUser.role === "WATCHMAN" && (
                  <>
                    <input
                      type="text"
                      name="badge_number"
                      placeholder="Badge Number"
                      value={newUser.badge_number}
                      onChange={handleInputChange}
                    />

                    <input
                      type="text"
                      name="shift"
                      placeholder="Shift"
                      value={newUser.shift}
                      onChange={handleInputChange}
                    />
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >

                <button
                  onClick={createUser}
                  disabled={creatingUser}
                >
                  {creatingUser
                    ? "Creating..."
                    : "Create User"}
                </button>

                <button
                  onClick={() =>
                    setShowAddUser(false)
                  }
                  disabled={creatingUser}
                >
                  Cancel
                </button>

              </div>

            </div>

          )}

          {loading && (
            <p>
              Loading users...
            </p>
          )}

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            users.length === 0 && (

              <p>
                No users found.
              </p>

            )}

          {!loading &&
            !error &&
            users.length > 0 && (

              <div className="incident-table">

                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns:
                      "0.5fr 1.1fr 1.5fr 1.2fr 1fr 1.3fr",
                  }}
                >

                  <span>ID</span>

                  <span>Username</span>

                  <span>Email</span>

                  <span>Phone</span>

                  <span>Role</span>

                  <span>Status</span>

                </div>

                {users.map((user) => (

                  <div
                    className="table-row"
                    key={user.id}
                    style={{
                      gridTemplateColumns:
                        "0.5fr 1.1fr 1.5fr 1.2fr 1fr 1.3fr",
                    }}
                  >

                    <span>
                      #{users.indexOf(user) + 1}
                    </span>

                    <span>
                      <strong>
                        {user.username || "---"}
                      </strong>
                    </span>

                    <span>
                      {user.email || "---"}
                    </span>

                    <span>
                      {user.phone || "---"}
                    </span>

                    <span>
                      {user.role || "---"}
                    </span>

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
                              updatingUser ===
                              user.id
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

        {!loading &&
          !error &&
          users.length > 0 && (

            <section className="dashboard-section">

              <h2>
                User Summary
              </h2>

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
                    👥 Total Users
                  </h3>

                  <h2>
                    {users.length}
                  </h2>

                  <p>
                    Total registered users.
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
                    🟢 Active Users
                  </h3>

                  <h2>
                    {
                      users.filter(
                        (user) =>
                          user.is_active
                      ).length
                    }
                  </h2>

                  <p>
                    Users with active accounts.
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
                    🏠 Residents
                  </h3>

                  <h2>
                    {
                      users.filter(
                        (user) =>
                          user.role ===
                          "RESIDENT"
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
                          user.role ===
                          "WATCHMAN"
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
