import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:1573/api/users/list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load users");
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

  return (
    <div className="users-page">

      <div className="users-header">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage neighbourhood users.</p>
        </div>

        <button
          className="back-button"
          onClick={() => {
            window.location.href = "/admin-dashboard";
          }}
        >
          ← Dashboard
        </button>
      </div>

      {loading && (
        <div className="users-message">
          Loading users...
        </div>
      )}

      {error && (
        <div className="users-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="users-card">

          <div className="users-count">
            Total Users: <strong>{users.length}</strong>
          </div>

          <table className="users-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>
                    <strong>{user.username}</strong>
                  </td>

                  <td>
                    {user.email || "-"}
                  </td>

                  <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.phone || "-"}
                  </td>

                  <td>
                    {user.is_active ? (
                      <span className="active-badge">
                        Active
                      </span>
                    ) : (
                      <span className="inactive-badge">
                        Inactive
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {users.length === 0 && (
            <div className="users-message">
              No users found.
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Users;