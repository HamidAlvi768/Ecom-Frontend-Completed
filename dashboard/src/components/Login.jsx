import { API_URL } from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add your login logic here, e.g., making an API request to authenticate the user.
    let result = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    result = await result.json();
    if (result.auth && result.user?.role === "admin") {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", JSON.stringify(result.auth));
        navigate('/dashboard');
      } else if (result.auth) {
        alert("This account is not an admin. Only admin accounts can use the dashboard.");
      } else {
        alert(result.result || "Login failed");
      }
    // Handle the result here (e.g., store token, redirect user, show error)
  };

  return (
    <div className="Login">
      <section>
        <div className="signin">
          <div className="content">
            <h2>Sign In</h2>
            <form className="form" onSubmit={handleLogin}>
              <div className="inputBox">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!email && <i>Email</i>}
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!password && <i>Password</i>}
              </div>
              <div className="links">
                <span>Admin accounts only</span>
              </div>
              <div className="inputBox">
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
