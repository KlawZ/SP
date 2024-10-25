import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [formType, setFormType] = useState("none");

  function updateRole(event) {
    setRole(event.target.value);
  }

  const handleSubmit = () => {
    event.preventDefault();
    if (username === "user" && password === "password") {
      console.log("testing");
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="intro">
        <h1>Welcome to TradeLearn</h1>
        <h2>Youre here to trade, were here to learn!</h2>
        <Button
          className="btn-custom register-btn"
          onClick={() => setFormType("register")}
        >
          Register
        </Button>
        <Button
          className="btn-custom login-btn"
          onClick={() => setFormType("login")}
        >
          Log In
        </Button>
      </div>
      {formType === "login" && (
        <div className="login-form-container">
          <h2 className="login-title">Log In</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="login-form">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="login-form">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="login-button">
              Submit
            </Button>
          </Form>
        </div>
      )}

      {formType === "register" && (
        <div className="login-form-container">
          <h2 className="login-title">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="login-form">
              <Form.Select value={role} onChange={updateRole}>
                <option value="investor">Investor</option>
                <option value="advisor">Advisor</option>
                <option value="administrator">Administrator</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="login-form">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="login-form">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="login-button">
              Submit
            </Button>
          </Form>
        </div>
      )}
      {formType === "none" && <></>}
    </div>
  );
}

export default Login;
