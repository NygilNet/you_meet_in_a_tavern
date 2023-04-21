import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ListHeader from '../ListHeader';
import './EventsListPage.css';

function EventsListPage() {

    const allEvents = useSelector(state => Object.values(state.events.allEvents));

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
                                    <div className='events-list-item-time'>{`${new Date(event.startDate).getFullYear()}-${(new Date(event.startDate).getMonth())+1}-${new Date(event.startDate).getDate()} • ${new Date(event.startDate).getHours()}:${new Date(event.startDate).getMinutes()}`}</div>
                                    <div className='events-list-item-title'><p id='subtitle' style={{margin: '0px'}}>{event.name}</p></div>
                                    <div className='events-list-item-location'>{event.Venue?.city ? `${event.Venue.city}, ${event.Venue.state}` : `No location provided`}</div>
                                </div>
                            </div>
                            <div style={{overflow: 'hidden'}}>{event.description}</div>
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
