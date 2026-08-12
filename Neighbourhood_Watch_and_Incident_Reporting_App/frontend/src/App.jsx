import { useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import Users from "./Users";
import Incidents from "./Incidents";
import Watchmen from "./Watchmen";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const userRole = sessionStorage.getItem("userRole");

  const goToLogin = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  // Protect Admin Dashboard
  if (window.location.pathname === "/admin-dashboard") {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>Please login as an administrator.</p>
          <button onClick={goToLogin}>Go to Login</button>
        </div>
      );
    }

    return <AdminDashboard />;
  }

  // Protect Users page
  if (window.location.pathname === "/users") {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <button onClick={goToLogin}>Go to Login</button>
        </div>
      );
    }

    return <Users />;
  }

  // Protect Watchmen page
  if (window.location.pathname === "/watchmen") {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <button onClick={goToLogin}>Go to Login</button>
        </div>
      );
    }

    return <Watchmen />;
  }

  // Protect Incidents page
  if (window.location.pathname === "/incidents") {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <button onClick={goToLogin}>Go to Login</button>
        </div>
      );
    }

    return <Incidents />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.trim() === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:1573/api/users/login/",
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

      // Store only non-sensitive login state.
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("userRole", data.role);

      if (rememberMe) {
        localStorage.setItem("rememberUsername", username.trim());
      } else {
        localStorage.removeItem("rememberUsername");
      }

      alert(
        `Login successful!\nWelcome ${data.username}\nRole: ${data.role}`
      );

      // Redirect based on role
      if (data.role === "ADMIN") {
        window.location.href = "/admin-dashboard";
      } else if (data.role === "RESIDENT") {
        window.location.href = "/resident-dashboard";
      } else if (data.role === "WATCHMAN") {
        window.location.href = "/watchman-dashboard";
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

      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <div className="login-section">

        <div className="login-box">

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Login to your account
          </p>

          <form onSubmit={handleLogin}>

            {/* Username */}
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

            {/* Password */}
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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Remember + Forgot */}
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
                  alert("Please contact the administrator to reset your password.");
                }}
              >
                Forgot Password?
              </a>

            </div>

            {/* Login */}
            <button
              type="submit"
              className="login-button"
            >
              LOGIN
            </button>

          </form>

          {/* Register */}
          <p className="signup">

            Don't have an account?

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Registration is currently handled by the administrator.");
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

export default App;