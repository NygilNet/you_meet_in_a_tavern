import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.statusCode === 401) setErrors(['The provided credentials were invalid']);
        }
      );
  };

  const demo = (e) => {
    dispatch(sessionActions.demoLogin());
    closeModal()
  }

  return (
    <div className="log-in-modal">
      <p className="log-in-title" id="title">Log In</p>
      <form onSubmit={handleSubmit} className="log-in-form">
        <ul>
          {errors.map((error, idx) => (
            <li className="error" style={{listStyle: "none", padding: "0"}} key={idx}>{error}</li>
          ))}
        </ul>
          <div className="log-in-form-elements">
            <div>
              <label>Username or Email</label>
              <input
            className="credential-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            style={{backgroundColor: '#e8f0fe'}}
          />
            </div>
            <div>
              <label>Password</label>
              <input
            className="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{backgroundColor: '#e8f0fe'}}
          />
            </div>
            <div>
              <button
              className="log-in-button"
              type="submit"
              id="log-in-button"
              disabled={password.length < 6 || credential.length < 4 ? true: false}>
          Log In
          </button>
            </div>
          </div>

      </form>
      <div onClick={demo} className="demo-log-in">Demo User</div>
    </div>
  );
}

export default LoginFormModal;
