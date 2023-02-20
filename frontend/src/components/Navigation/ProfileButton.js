import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');
  };


  const viewGroupsButton = () => {
    closeMenu();
    history.push('/groups');
  }

  const viewEventsButton = () => {
    closeMenu();
    history.push('/events');
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="navigation-right-side">
      {user ? (
      <>
      <NavLink to="/groups/new" id="new-group">Start a new group</NavLink>
      </>) : null }
      <button onClick={openMenu} id="profile">
        <i className="fas fa-user-circle fa-2x" />{showMenu ? "∧" : "∨"}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li onClick={viewGroupsButton} style={{cursor: 'pointer'}}>View Groups</li>
        <li onClick={viewEventsButton} style={{cursor: 'pointer'}}>Find an event</li>
        {user ? (
          <>
            <li>Hello, "{user.firstName}"</li>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout} id="profile-logout">Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
