import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteEvent } from '../../store/events'
import './DeleteEventModal.css';

function DeleteEventModal({ eventId, groupId }) {

    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        return dispatch(deleteEvent(eventId))
            .then(closeModal)
            .then(history.push(`/groups/${groupId}`));
    }

    return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this event?</p>
            <button id='confirm' onClick={handleDelete}>{`Yes (Delete Event)`}</button>
            <button id='deny' onClick={closeModal}>{`No (Keep Event)`}</button>
        </div>
    )
}

export default DeleteEventModal;
