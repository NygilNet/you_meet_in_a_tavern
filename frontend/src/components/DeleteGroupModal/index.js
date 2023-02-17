import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteGroup } from '../../store/groups';
import './DeleteGroupModal.css';

function DeleteGroupModal({ groupId }) {

    console.log(groupId);
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        return dispatch(deleteGroup(groupId))
            .then(closeModal)
            .then(history.push('/groups'));
    }


    return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this group?</p>
            <button id='confirm' onClick={handleDelete}>{`Yes (Delete Group)`}</button>
            <button id='deny' onClick={closeModal}>{`No (Keep Group)`}</button>
        </div>

    )
}

export default DeleteGroupModal;
