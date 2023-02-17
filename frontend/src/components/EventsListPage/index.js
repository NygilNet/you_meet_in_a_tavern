import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ListHeader from '../ListHeader';
import './EventsListPage.css';

function EventsListPage() {

    const events = useSelector(state => Object.values(state.events.allEvents));

    return (
       <div className='events-list-page-container'>
        <ListHeader headerType="events" />
        <div className='events-list'>
            {
                events.map(event => (
                    <NavLink to={`/events/${event.id}`} key={event.id} style={{textDecoration: 'none'}}>
                        <div className='events-list-item'>
                            <div className='events-list-item-info'>
                                <div className='events-list-item-image'>
                                    {
                                        event.previewImage === 'no preview image provided' ? (
                                            <p>No image provided</p>
                                        ) : (
                                            <img
                                            src={event.previewImage}
                                            alt={event.description}
                                            style={{ height: '124px', width: '178px', objectFit: 'cover'}}
                                            />
                                        )
                                    }
                                </div>
                                <div className='events-list-item-details'>
                                    <div className='events-list-item-time'></div>
                                    <div className='events-list-item-title'>{event.name}</div>
                                    <div className='events-list-item-location'></div>
                                </div>
                            </div>
                            <div>{event.description}</div>
                        </div>
                    </NavLink>
                ))
            }
        </div>
    </div>
    )
}

export default EventsListPage;
