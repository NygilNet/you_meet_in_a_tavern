import React, { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleGroup } from '../../store/groups';
import './GroupDetailsPage.css';

function GroupDetailsPage({ user }) {
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
       dispatch(
        getSingleGroup(id)
    );
    }, [dispatch, id])

    const group = useSelector(state => state.groups.singleGroup);
    const previewImg = group.GroupImages?.find(img => img?.preview)?.url;

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
                                ## events • {
                                    group.private === true ? `Private` : `Public`
                                }
                            </div>
                            <div className='group-info-organizer'>
                                {`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}
                            </div>
                        </div>
                        <div className='group-button'>
                            <button></button>
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
            </div>
        </div>
    );
}

export default GroupDetailsPage;
