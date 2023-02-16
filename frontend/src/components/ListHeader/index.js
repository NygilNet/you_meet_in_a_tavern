import React from 'react';
import { NavLink } from 'react-router-dom';
import './ListHeader.css';

function ListHeader({ headerType }) {


    return (
        <div className='list-header-container'>
            <div id="list-header-links">
                <NavLink
                to="/events"
                id={headerType === 'events' ? 'current-page' : 'active-link'}
                >Events</NavLink>
                <NavLink
                to="/groups"
                id={headerType === 'groups' ? 'current-page': 'active-link'}
                >Groups</NavLink>
            </div>
            <div id="list-header-caption">
                {headerType === 'groups' && (<p>Groups in Meetup</p>)}
                {headerType === 'events' && (<p>Events in Meetup</p>)}
            </div>

        </div>
    );
}

export default ListHeader;
