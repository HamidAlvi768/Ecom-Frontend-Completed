import React, { useState } from 'react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async() => {
    // Add your login logic here, e.g., making an API request to authenticate the user.
    let result = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type ':  'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    
      result = await result.json();
    
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

