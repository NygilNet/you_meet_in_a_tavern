import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='header-container'>
      <div className='header-logo'>
        <NavLink exact to="/">You Meet In A Tavern</NavLink>
      </div>
      {isLoaded && (
        <div className='header-profile-button'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
