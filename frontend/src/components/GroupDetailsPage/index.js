import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleGroup } from '../../store/groups';
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';
import Footer from '../Footer';
import './GroupDetailsPage.css';

function GroupDetailsPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
       dispatch(
        getSingleGroup(id)
    );
    }, [dispatch, id]);

    const comingSoon = (e) => {
        return alert('Feature coming soon');
    }


    const userId = useSelector(state => state.session.user?.id);
    const group = useSelector(state => state.groups.singleGroup);
    const previewImg = group.GroupImages?.find(img => img?.preview)?.url;
    const isOrganizer = +userId === +group?.organizerId;

    const events = useSelector(state => Object.values(state.events.allEvents));
    const groupEvents = events.filter(event => event.groupId === group.id);

    let upComingEvents = [];
    let pastEvents = [];

    groupEvents.forEach(event => {
        if (Date.parse(event.startDate) > Date.parse(Date())) {
            upComingEvents.push(event);
        } else {
            pastEvents.push(event);
        }
    })

    upComingEvents.sort((a,b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    pastEvents.sort((a,b) => Date.parse(a.startDate) - Date.parse(b.startDate));


    if (!Object.values(group)[0]) return null;

    return (
        <div className='container'>
            <div className='group-details-page-container'>
            <div className='group-details-page'>
               <div className='group-details-breadcrumb-link'>
                {`<`} <NavLink to='/groups'>Groups</NavLink>
                </div>
                <div className='group-details-group-info'>
                    <div className='group-info-image'>
                        {
                            previewImg ? (
                                <img
                                src={previewImg}
                                alt={group.about}
                                style={{ height: '320px', width: '544px', objectFit: 'cover'}}
                                />
                            ) : 'No image provided'
                        }
                    </div>
                    <div className='group-info-info'>
                        <div className='group-info-details'>
                            <div className='group-info-name'>
                                <p id='subtitle' style={{margin: '0px'}}>{group.name}</p>
                            </div>
                            <div className='group-info-location'>
                                {
                                    group.type === 'Online' ? group.type : `${group.city}, ${group.state}`
                                }
                            </div>
                            <div className='group-info-cetera'>
                                {groupEvents.length} events • {
                                    group.private === true ? `Private` : `Public`
                                }
                            </div>
                            <div className='group-info-organizer'>
                                {`Organized by: ${group.Organizer.firstName} ${group.Organizer.lastName}`}
                            </div>
                        </div>
                        <div className='group-button'>
                            {
                                isOrganizer ? (
                                    <div className='organizer-button'>
                                        <button onClick={e => history.push(`/groups/${group.id}/events/new`)}>Create event</button>
                                        <button onClick={e => history.push(`/groups/${group.id}/edit`)}>Update</button>
                                        <OpenModalButton
                                        buttonText="Delete"
                                        modalComponent={<DeleteGroupModal groupId={group.id} />}
                                        />
                                    </div>
                                ) : (
                                    <div className='viewer-button'>
                                        <button onClick={comingSoon} id='viewer-button'>Join this group</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='group-details-extra-info'>
                <div className='extra-info-group-details'>
                    <div className='organizer-details'>
                        <p id='subtitle'>Organizer</p>
                        <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                    </div>
                    <div className='what-were-about'>
                        <p id='subtitle'>What we're about</p>
                        <p>{group.about}</p>
                    </div>
                </div>
            <div className='group-details-events'>
                { upComingEvents[0] ? (
                    <div className='group-events-upcoming'>
                        <p id='subtitle'>Upcoming Events {`(${upComingEvents.length})`}</p>
                        {
                            upComingEvents.map(event => (
                                <NavLink to={`/events/${event.id}`} className='group-events-card-background' key={event.name}>
                                    <div className='group-events-card'>
                                        <div className='group-events-card-top'>
                                            <div className='group-events-card-img'>
                                            {event.previewImage === 'no preview image provided' ? 'No preview image provided' : (
                                                <img
                                                alt={event.description}
                                                src={event.previewImage}
                                                style={{ height: '127px', width: '178px', objectFit:'cover'}}
                                                />
                                            )}
                                        </div>
                                        <div className='group-events-card-info'>
                                            <div>{`${new Date(event.startDate).getFullYear()}-${(new Date(event.startDate).getMonth())+1}-${new Date(event.startDate).getDate()} • ${new Date(event.startDate).getHours()}:${new Date(event.startDate).getMinutes()}`}</div>
                                            <div><p id='subtitle'>{event.name}</p></div>
                                            <div>{event.Venue?.city ? `${event.Venue.city}, ${event.Venue.state}` : `No location provided`}</div>
                                        </div>
                                        </div>

                                    <div className='group-events-card-description'>{event.description}</div>
                                    </div>
                                </NavLink>
                            ))
                        }
                    </div>
                ) : 'No upcoming events yet' }
                { pastEvents[0] ? (
                    <div className='group-events-past'>
                        <h2>Past Events {`(${pastEvents.length})`}</h2>
                        {
                            pastEvents.map(event => (
                                <NavLink to={`/events/${event.id}`} className='group-events-card-background' key={event.name} style={{textDecoration: 'none'}}>
                                    <div className='group-events-card'>
                                        <div className='group-events-card-img'>
                                            {event.previewImage === 'no preview image provided' ? 'No preview image provided' : (
                                                <img
                                                alt={event.description}
                                                src={event.previewImage}
                                                style={{ height: '127px', width: '178px', objectFit:'cover'}}
                                                />
                                            )}
                                        </div>
                                        <div className='group-events-card-info'>
                                            <div>{`${new Date(event.startDate).getFullYear()}-${(new Date(event.startDate).getMonth())+1}-${new Date(event.startDate).getDate()} • ${new Date(event.startDate).getHours()}:${new Date(event.startDate).getMinutes()}`}</div>
                                            <div>{event.name}</div>
                                            <div>{event.Venue?.city ? `${event.Venue.city}, ${event.Venue.state}` : `No location provided`}</div>
                                        </div>
                                    </div>
                                    <div className='group-events-card-description'>{event.description}</div>
                                </NavLink>
                            ))
                        }
                    </div>
                ) : null }
            </div>
            </div>
        </div>
        </div>

    );
}

export default GroupDetailsPage;
