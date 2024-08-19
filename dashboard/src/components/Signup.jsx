import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Login } from './Login';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('')
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // Add your signup logic here, e.g., making an API request to create a new user.
    let result = await fetch('https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });
    
    result = await result.json();

    if (result) {
      // Set user data only if successful signup
      // setUser(result);
      localStorage.setItem("user", JSON.stringify(result));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate('/');
    }
    // Handle the result here (e.g., store token, redirect user, show error)
  };

  return (
    <div className="Signup">
      <section>
        <div className="signup">
          <div className="content">
            <h2>Sign Up</h2>
            <form className="form" onSubmit={handleSignup}>
              <div className="inputBox">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <i>Name</i>
              </div>
              <div className="inputBox">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i>Email</i>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i>Password</i>
              </div>
              <div className="links">
                <Link to="/login">Already have an account? Login</Link>
              </div>
              <div className="inputBox">
                <input type="submit" value="Sign Up" />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
