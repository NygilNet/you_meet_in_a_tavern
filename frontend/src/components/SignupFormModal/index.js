import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [validSignIn, setValidSignIn] = useState(false)
  const { closeModal } = useModal();

  useEffect(() => {

    if (!email) return setValidSignIn(false);
    if (!username || username.length < 4) return setValidSignIn(false);
    if (!firstName) return setValidSignIn(false);
    if (!lastName) return setValidSignIn(false);
    if (!password || password.length < 6) return setValidSignIn(false);
    if (confirmPassword !== password) return setValidSignIn(false);

    setValidSignIn(true);

  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.values(data.errors));
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
      <p id="title" style={{textAlign: 'center'}}>Sign Up</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            style={{backgroundColor: '#e8f0fe'}}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            style={{backgroundColor: '#e8f0fe'}}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            style={{backgroundColor: '#e8f0fe'}}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            style={{backgroundColor: '#e8f0fe'}}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            style={{backgroundColor: '#e8f0fe'}}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            style={{backgroundColor: '#e8f0fe'}}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button
        type="submit"
        id="sign-up-button"
        disabled={validSignIn ? false : true} >
          Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
