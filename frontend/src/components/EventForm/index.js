import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { newEvent } from '../../store/events';
import { getSingleGroup } from '../../store/groups';

import './EventForm.css';

function EventForm({ event, formType }) {

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

        setAttemptedSubmit(false);
    }

    if (organizerId !== userId) return (<Redirect to="/" />)

    return (
        <div className='event-form-container'>
            <form onSubmit={handleSubmit}>

                <input type="submit" value={formType} disabled={attemptedSubmit && Object.values(errors)[0] ? true : false} />
            </form>
        </div>
    )

}

export default EventForm;
