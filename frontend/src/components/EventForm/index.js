import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { newEvent } from '../../store/events';
import { getSingleGroup } from '../../store/groups';
import Footer from '../Footer';

import './EventForm.css';

function EventForm({ event, formType }) {

    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(
            getSingleGroup(id)
        )
    }, [dispatch, id])

    const userId = useSelector(state => state.session.user.id)
    const group = useSelector(state => state.groups.singleGroup);

    const [name, setName] = useState(event.name);
    const [type, setType] = useState(event.type);
    const [pri, setPri] = useState(event.pri);
    const [price, setPrice] = useState(event.price);
    const [startDate, setStartDate] = useState(event.startDate);
    const [endDate, setEndDate] = useState(event.endDate);
    const [imgUrl, setImgUrl] = useState(event.imgUrl);
    const [description, setDescription] = useState(event.description);

    const [errors, setErrors] = useState({});
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    useEffect(() => {
        const error = {};
        const acceptedExtensions = ['png', 'jpg', 'jpeg'];

        if (!name) error.name = 'Name is required';
        if (!type) error.type = 'Event Type is required';
        if (!pri) error.pri = 'Visibility is required';
        if (!price) error.price = 'Price is required';
        if (!startDate) error.startDate = 'Event start is required';
        if (!endDate) error.endDate = 'Event end is required';
        if (imgUrl) {
            if (!acceptedExtensions.includes(imgUrl.split('.')[imgUrl.split('.').length - 1])) error.imgUrl = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (!description) error.description = 'Description must be at least 30 characters long';

        setErrors(error);
    }, [name, type, pri, price, startDate, endDate, imgUrl, description])

    const handleSubmit = (e) => {
        e.preventDefault();
        setAttemptedSubmit(true);

        if (Object.values(errors)[0]) return alert('Can not submit');

        if (formType === "Create Event") {
            dispatch(
                newEvent(group.id, {
                    name,
                    type,
                    price,
                    startDate,
                    endDate,
                    description,
                    imgUrl
                })
            ).then(newId => history.push(`/events/${newId}`));
        }

        setAttemptedSubmit(false);
    }

    if (group.organizerId !== userId) return history.push('/');

    return (
        <div>
            <div className='event-form-container'>
            <form onSubmit={handleSubmit}>
                {formType === 'Create Event' && (
                    <p id="title">Create an event for {group.name}</p>
                )}
                <div className='event-form-name'>
                    <p>What is the name of your event?</p>
                    <input
                    type="text"
                    placeholder='Event Name'
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                    {attemptedSubmit && errors.name && (<div id='error'>{errors.name}</div>)}
                </div>
                <div className='event-form-physical-info'>
                    <p>Is this an in person or online event?</p>
                    <select
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    value={type}
                    onChange={e => setType(e.target.value)}
                    >
                        <option value="">{`(select one)`}</option>
                        <option value="In Person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                    {attemptedSubmit && errors.type && (<div id='error'>{errors.type}</div>)}

                    <p>Is this event private or public?</p>
                    <select
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    value={pri}
                    onChange={e => setPri(e.target.value)}
                    >
                        <option value="">{`(select one)`}</option>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>
                    {attemptedSubmit && errors.pri && (<div id='error'>{errors.pri}</div>)}

                    <p>What is the price for your event?</p>
                    <input type="" style={{backgroundColor: '#e8f0fe', width: '300px'}} value={price} onChange={e => setPrice(e.target.value)} placeholder="0" />
                    {attemptedSubmit && errors.price && (<div id='error'>{errors.price}</div>)}
                </div>
                <div className='event-form-time-info'>
                    <p>When does your event start?</p>
                    <input value={startDate} style={{backgroundColor: '#e8f0fe', width: '300px'}} type="datetime-local" onChange={e => setStartDate(e.target.value)} placeholder="MM/DD/YYYY HH:mm AM" />
                    {attemptedSubmit && errors.startDate && (<div id='error'>{errors.startDate}</div>)}

                    <p>When does your event end?</p>
                    <input value={endDate} style={{backgroundColor: '#e8f0fe', width: '300px'}} type="datetime-local" onChange={e => setEndDate(e.target.value)} placeholder="MM/DD/YYY HH:mm PM" />
                    {attemptedSubmit && errors.endDate && (<div id='error'>{errors.endDate}</div>)}
                </div>
                <div className='event-form-image'>
                    <p>Please add in image url for your event below:</p>
                    <input value={imgUrl} style={{backgroundColor: '#e8f0fe', width: '300px'}} onChange={e => setImgUrl(e.target.value)} placeholder='Image URL' />
                    {attemptedSubmit && errors.imgUrl && (<div id='error'>{errors.imgUrl}</div>)}
                </div>
                <div className='event-form-description'>
                    <p>Please describe your event:</p>
                    <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='Please include at least 30 characters'
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    rows={6}
                    cols={42}
                    ></textarea>
                    {attemptedSubmit && errors.description && (<div id='error'>{errors.description}</div>)}
                </div>
                <input className="event-form-submit-button" type="submit" value={formType} disabled={attemptedSubmit && Object.values(errors)[0] ? true : false} />
            </form>
        </div>
        </div>

    )

}

export default EventForm;
