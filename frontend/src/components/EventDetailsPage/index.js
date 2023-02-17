import React, { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleEvent } from '../../store/events';
import { getSingleGroup } from '../../store/groups';
import './EventDetailsPage.css';

function EventDetailsPage() {

    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(
            getSingleEvent(id)
        );
    }, [dispatch, id])

    const userId = useSelector(state => state.session.user?.id);
    const event = useSelector(state => state.events.singleEvent);
    const eventPreviewImg = event.EventImages?.find(img => img?.preview)?.url;

    useEffect(() => {
        dispatch(
            getSingleGroup(event.groupId)
        );
    }, [dispatch, event])

    const group = useSelector(state => state.groups.singleGroup);
    const groupPreviewImg = group.GroupImages?.find(img => img?.preview)?.url;
    const isOrganizer = userId === group?.organizerId;

    if(!Object.values(event)[0]) return null;

    return (
        <div className='event-details-container'>
            <div className='event-details-page'>
                <div className='event-details-breadcrumb-link'>
                    {`<`} <NavLink to='/events'>Events</NavLink>
                </div>
                <div className='event-details-name-host'>
                    <h2>{event.name}</h2>
                    <p>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</p>
                </div>
            </div>
            <div className='event-details-gray-background'>
                <div className='event-details-card'>
                    <div className='event-details-card-image'>
                        {
                            eventPreviewImg ? (
                                <img
                                src={eventPreviewImg}
                                alt={event.description}
                                style={{ height: '320px', width: '544px', objectFit: 'cover'}}
                                />
                            ) : 'No image provided'
                        }
                    </div>
                    <div className='event-details-card-info'>
                        <div className='event-details-card-info-group'>
                            <div className='event-details-card-info-group-image'>
                                {
                                    groupPreviewImg ? (
                                        <img
                                        src={groupPreviewImg}
                                        alt={group.about}
                                        style={{ height:'62px', width: '90px', objectFit: 'cover'}}
                                        />
                                    ) : 'No image provided'
                                }
                            </div>
                            <div className='event-details-card-info-group-info'>
                                <p>{group.name}</p>
                                <p>{group.type}</p>
                            </div>
                        </div>
                        <div className='event-details-card-info-details'>
                            <div className='event-details-card-info-details-time'>
                                <div id='event-details-card-logo'><i class="fa-regular fa-clock" /></div>
                                <div>
                                    <div className='event-details-card-info-details-time-start'>
                                        <div>START</div>
                                        <p>{`${new Date(event.startDate).getFullYear()}-${(new Date(event.startDate).getMonth())+1}-${new Date(event.startDate).getDate()} • ${new Date(event.startDate).getHours()}:${new Date(event.startDate).getMinutes()}`}</p>
                                    </div>
                                    <div className='event-details-card-info-details-time-end'>
                                        <div>END</div>
                                        <p>{`${new Date(event.endDate).getFullYear()}-${(new Date(event.endDate).getMonth())+1}-${new Date(event.endDate).getDate()} • ${new Date(event.endDate).getHours()}:${new Date(event.endDate).getMinutes()}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='event-details-card-info-details-price'>
                                <div id='event-details-card-logo'><i class="fa-solid fa-dollar-sign" /></div>
                                <div className='event-details-card-info-details-price-cost'>
                                    <p>{event.price === 0 ? 'FREE' : event.price }</p>
                                </div>
                            </div>
                            <div className='event-details-card-info-details-type'>
                                <div id='event-details-card-logo'><i class="fa-solid fa-map-pin" /></div>
                                <div className='event-details-card-info-details-type-location'>
                                    <p>{event.type}</p>
                                </div>
                                {isOrganizer ? (
                                    <div className='event-details-card-info-details-organizer-buttons'>
                                        <button>Update</button>
                                        <button>Delete</button>
                                    </div>
                                ) : null }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='event-details-details'>
                    <h2>Details</h2>
                    <p>{event.description}</p>
                </div>
            </div>
        </div>
    )
}

export default EventDetailsPage;
