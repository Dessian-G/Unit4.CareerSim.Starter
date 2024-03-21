// Authenticate.jsx

import React, { useState } from 'react';

function Authenticate({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend server to authenticate the user
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Parse the JSON response
      const data = await response.json();

      if (response.ok) {
        // If authentication is successful, call the onLogin function with the user data
        onLogin(data.user);
      } else {
        // If authentication fails, display an error message
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      // Handle any network or server errors
      console.error('Error:', error);
      alert('An error occurred while authenticating');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Authenticate;
