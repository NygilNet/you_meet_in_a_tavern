import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ListHeader from '../ListHeader';
import Footer from '../Footer';
import './GroupsListPage.css';

function GroupsListPage() {

    const groups = useSelector(state => Object.values(state.groups.allGroups));
    const events = useSelector(state => Object.values(state.events.allEvents));

    return (
        <div className='container'>
            <div className='groups-list-page-container'>
            <ListHeader headerType="groups" />
            <div className='groups-list'>
                {
                    groups.map(group => (
                        <NavLink to={`/groups/${group.id}`} key={group.id} style={{textDecoration: 'none', color: '#000000'}}>
                            <div className='groups-list-item'>
                                <div className='list-item-image'>
                                    {
                                        group.previewImage === 'no preview image provided' ? (
                                            <p>No image provided</p>
                                        ) : (
                                          <img
                                    src={group.previewImage}
                                    alt={group.about}
                                    style={{ height: '124px', width: '178px', objectFit: 'cover'}}
                                    />
                                        )
                                    }

                                </div>
                                <div className='list-item-info'>
                                    <div className='list-item-info-name'>
                                        <p id='title' style={{padding: '0px', margin: '0px'}}>{group.name}</p>
                                    </div>
                                    <div className='list-item-info-location'>
                                        {
                                            group.type === 'Online' ? (
                                                group.type
                                            ) : (
                                                `${group.city}, ${group.state}`
                                            )
                                        }
                                    </div>
                                    <div className='list-item-info-about'>
                                        {group.about}
                                    </div>
                                    <div className='list-item-info-cetera'>
                                        {events.filter(event => event.groupId === group.id).length} events • {group.private ? 'Private' : 'Public'}
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    ))
                }
            </div>
        </div>
        </div>

    )
}

export default GroupsListPage;
