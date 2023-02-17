import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { newEvent } from '../../store/events';
import { getSingleGroup } from '../../store/groups';

import './EventForm.css';

function EventForm() {

    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(
            getSingleGroup(id)
        )
    }, [])

    const userId = useSelector(state => state.session.user.id)
    const organizerId = useSelector(state => state.groups.singleGroup.organizerId);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    if (organizerId !== userId) return (<Redirect to="/" />)

    return (
        <div className='event-form-container'>
            <form onSubmit={handleSubmit}>

            </form>
        </div>
    )

}

export default EventForm;
