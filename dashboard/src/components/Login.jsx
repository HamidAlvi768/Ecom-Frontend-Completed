import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add your login logic here, e.g., making an API request to authenticate the user.
    let result = await fetch("https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/login", {
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
    if (result.auth) {
        // navigate to home page
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", JSON.stringify(result.auth));
        navigate('/');
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
                <Link to="/signup">Forgot Password</Link>
                <Link to="/signup">Signup</Link>
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
