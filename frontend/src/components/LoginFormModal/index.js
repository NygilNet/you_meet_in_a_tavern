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
            <li key={idx}>{error}</li>
          ))}
        </ul>
          <div className="log-in-form-elements">
            <div>
              <label>Username or email</label>
              <input
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{backgroundColor: '#e8f0fe'}}
          />
            </div>
            <div>
              <button
        type="submit"
        id="log-in-button"
        disabled={password.length < 6 || credential.length < 4 ? true: false}>
          Log In
          </button>
            </div>
          </div>

      </form>
      <div onClick={demo} className="demo-log-in">Log in as Demo User</div>
    </div>
  );
}

export default LoginFormModal;
