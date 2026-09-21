import { useState } from "react";
import "./App.css";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import Users from "./Users";
import Incidents from "./Incidents";
import Watchmen from "./Watchmen";
import Reports from "./report";
import Assignments from "./Assignments";
import InchargeDashboard from "./InchargeDashboard";
import WatchmanDashboard from "./WatchmanDashboard";
import ResidentDashboard from "./ResidentDashboard";

const API_BASE =
  "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.trim() === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/users/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("userRole", data.role);

      if (rememberMe) {
        localStorage.setItem(
          "rememberUsername",
          username.trim()
        );
      } else {
        localStorage.removeItem("rememberUsername");
      }

      alert(
        `Login successful!\nWelcome ${data.username}\nRole: ${data.role}`
      );

      if (data.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (data.role === "RESIDENT") {
        navigate("/resident-dashboard");
      } else if (data.role === "WATCHMAN") {
        navigate("/watchman-dashboard");
      } else if (data.role === "INCHARGE") {
        navigate("/incharge-dashboard");
      } else {
        alert("Unknown user role.");
        sessionStorage.clear();
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to Django server");
    }
  };

  return (
    <div className="page">

      <div className="image-section">

        <img
          src="/apartment.png"
          alt="Apartment"
          className="apartment-image"
        />

        <div className="brand-section">
          <h1>Community Sentinel</h1>

          <p>
            Neighborhood Watch & Incident Reporting System
          </p>
        </div>

      </div>

      <div className="login-section">

        <div className="login-box">

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Login to your account
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>Username</label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                autoComplete="username"
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="password-box">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <div className="options">

              <label className="remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                Remember me

              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  alert(
                    "Please contact the administrator to reset your password."
                  );
                }}
              >
                Forgot Password?
              </a>

            </div>

            <button
              type="submit"
              className="login-button"
            >
              LOGIN
            </button>

          </form>

          <p className="signup">

            Don't have an account?

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();

                alert(
                  "Registration is currently handled by the administrator."
                );
              }}
            >
              {" "}Register
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

function ProtectedRoute({ children }) {

  const isLoggedIn =
    sessionStorage.getItem("isLoggedIn") === "true";

  const userRole =
    sessionStorage.getItem("userRole");

  if (!isLoggedIn || userRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {

  return (
    <HashRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Incidents */}
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <Incidents />
            </ProtectedRoute>
          }
        />

        {/* Watchmen */}
        <Route
          path="/watchmen"
          element={
            <ProtectedRoute>
              <Watchmen />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Assignments */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />

        {/* Incharge Dashboard */}
        <Route
          path="/incharge-dashboard"
          element={<InchargeDashboard />}
        />

        {/* Watchman Dashboard */}
        <Route
          path="/watchman-dashboard"
          element={<WatchmanDashboard />}
        />

        {/* Resident Dashboard */}
        <Route
          path="/resident-dashboard"
          element={<ResidentDashboard />}
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </HashRouter>
  );
}

export default App;
