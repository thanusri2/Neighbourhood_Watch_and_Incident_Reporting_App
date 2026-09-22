import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  "https://neighbourhood-watch-and-incident-h09c.onrender.com";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/users/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Resident registration successful!");

      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
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

          <h2>Create Account</h2>

          <p className="subtitle">
            Register as a Resident
          </p>

          <form onSubmit={handleRegister}>

            <div className="input-group">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="login-button"
            >
              REGISTER
            </button>

          </form>

          <p className="signup">

            Already have an account?

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              {" "}Login
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
