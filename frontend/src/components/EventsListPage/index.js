import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListHeader from '../ListHeader';
import { resetEvent } from '../../store/events';
import { resetGroup } from '../../store/groups';
import './EventsListPage.css';

function EventsListPage() {

    const dispatch = useDispatch();
    const allEvents = useSelector(state => Object.values(state.events.allEvents));

    useEffect(() => {
        dispatch(resetEvent());
        dispatch(resetGroup());
    }, [dispatch])

    let upComingEvents = [];
    let pastEvents = [];

    allEvents.forEach(event => {
        if (Date.parse(event.startDate) > Date.parse(Date())) {
            upComingEvents.push(event);
        } else {
            pastEvents.push(event);
        }
    });

    upComingEvents.sort((a,b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    pastEvents.sort((a,b) => Date.parse(a.startDate) - Date.parse(b.startDate));

    const events = [...upComingEvents, ...pastEvents];

    return (
        <div className='container'>

       <div className='events-list-page-container'>
        <ListHeader headerType="events" />
        <div className='events-list'>
            {
                events.map(event => (
                    <NavLink to={`/events/${event.id}`} key={event.id} style={{textDecoration: 'none', color: '#000000'}}>
                        <div className='events-list-item'>
                            <div className='events-list-item-info'>
                                <div className='events-list-item-image'>
                                    {
                                        event.previewImage === 'no preview image provided' ? (
                                            <p>No image provided</p>
                                        ) : (
                                            <img
                                            className='event-preview-img'
                                            src={event.previewImage}
                                            alt={event.description}
                                            />
                                        )
                                    }
                                </div>
                                <div className='events-list-item-details'>
                                    <div className='events-list-item-time'>{`${new Date(event.startDate).getFullYear()}-${(new Date(event.startDate).getMonth())+1}-${new Date(event.startDate).getDate()} • ${new Date(event.startDate).getHours()}:${new Date(event.startDate).getMinutes()}`}</div>
                                    <div className='events-list-item-title'><h2>{event.name}</h2></div>
                                    <div className='events-list-item-location'>{event.Venue?.city ? `${event.Venue.city}, ${event.Venue.state}` : `No location provided`}</div>
                                </div>
                            </div>
                            <div className='events-list-item-about'>{event.description}</div>
                        </div>
                    </NavLink>
                ))
            }
        </div>
    </div>
        </div>
    )
}

export default EventsListPage;
