import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleGroup } from '../../store/groups';
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

    upComingEvents.sort((a,b) => a.startDate - b.startDate);
    pastEvents.sort((a,b) => a.startDate - b.startDate);


    if (!Object.values(group)[0]) return null;

    return (
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
                                {group.name}
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
                                        <button>Delete</button>
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
                        <h2>Organizer</h2>
                        <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                    </div>
                    <div className='what-were-about'>
                        <h2>What we're about</h2>
                        <p>{group.about}</p>
                    </div>
                </div>
            <div className='group-details-events'>
                { upComingEvents[0] ? (
                    <div className='group-events-upcoming'>
                        <h2>Upcoming Events {`(${upComingEvents.length})`}</h2>
                    </div>
                ) : null }
                { pastEvents[0] ? (
                    <div className='group-events-past'>
                        <h2>Past Events {`(${pastEvents.length})`}</h2>
                    </div>
                ) : null }
            </div>
            </div>
        </div>
    );
}

export default GroupDetailsPage;
