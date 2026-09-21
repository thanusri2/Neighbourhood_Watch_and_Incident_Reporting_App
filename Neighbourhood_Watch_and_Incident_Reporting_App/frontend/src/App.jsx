import { useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
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

function Login() {
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
        "https://neighbourhood-watch-and-incident-h09c.onrender.com/api/users/login/",
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
        window.location.href = "/admin-dashboard";
      } else if (data.role === "RESIDENT") {
        window.location.href = "/resident-dashboard";
      } else if (data.role === "WATCHMAN") {
        window.location.href = "/watchman-dashboard";
      } else if (data.role === "INCHARGE") {
        window.location.href = "/incharge-dashboard";
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
                onChange={(e) => setUsername(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <Incidents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchmen"
          element={
            <ProtectedRoute>
              <Watchmen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/assignments" 
          element={ 
            <ProtectedRoute> 
              <Assignments /> 
            </ProtectedRoute> 
          } 
        />
        <Route
          path="/incharge-dashboard"
          element={
            <InchargeDashboard />
          }
        />
        <Route
          path="/watchman-dashboard"
          element={
            <WatchmanDashboard />
          }
        />
        <Route
          path="/resident-dashboard"
          element={
            <ResidentDashboard />
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;