import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [creds, setCreds] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    setLoading(true);
    
    if (!creds.username || !creds.password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username: creds.username,
        password: creds.password
      });
      
      const data = response.data;
      // console.log(response);
      
      if (response.status !== 200) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLogin && onLogin(data.user);
      
      navigate("/stats");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <br />
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <span>Username:</span>
      <br />
      <input
        type="text"
        onChange={(e) => setCreds({ ...creds, username: e.target.value })}
      />
      <br />
      <span>Password:</span>
      <br />
      <input
        type="password"
        onChange={(e) => setCreds({ ...creds, password: e.target.value })}
      />
      <br />
      <br />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
