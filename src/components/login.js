import React, { useState, useEffect } from "react";
import { BASE_URL } from "../api";

const Login = () => {
  const [localToken, setLocalToken] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  const setToken = (newToken) => {
    setLocalToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const loginUser = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            username,
            password,
          },
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setToken(result.data.token);
        fetchUserData(result.data.token);
        window.location.reload();
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during login. Please try again.");
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUserData(result.data);
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching user data.");
    }
  };

  const logoutUser = () => {
    setToken(null);
    setError(null);
    localStorage.removeItem("token");
    setUserData(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    }
  }, []);

  const isLoggedIn = () => {
    return !!localToken;
  };

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { username, password } = e.target.elements;
          setUsername(username.value);
          loginUser(username.value, password.value);
        }}
      >
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <button onClick={logoutUser}>Logout</button>
      {error && <p>{error}</p>}
      {isLoggedIn() && userData && (
        <div>
          <p>Welcome, {userData.username}!</p>
        </div>
      )}
    </div>
  );
};

export default Login;


