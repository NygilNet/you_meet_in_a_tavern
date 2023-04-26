import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { newGroup, editGroup } from '../../store/groups';
import Footer from '../Footer';
import './GroupForm.css';


function GroupForm({ group, formType }) {

    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [location, setLocation] = useState(group.location);
    const [name, setName] = useState(group.name);
    const [about, setAbout] = useState(group.about);
    const [type, setType] = useState(group.type);
    const [pri, setPri] = useState(group.pri);
    const [previewImg, setPreviewImg] = useState(group.previewImg);

    const [errors, setErrors] = useState({});
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    useEffect(() => {
        const error = {};
        const acceptedExtensions = ['png', 'jpg', 'jpeg'];

        if (!location) error.location = 'Location is required';
        if (location && (!location.split(', ')[1] || location.split(', ')[2])) error.location = 'Location must be formatted as City, STATE';
        if (!name) error.name = 'Name is required';
        if (about.length <= 30) error.about = 'Description must be at least 30 characters long';
        if (!type) error.type = 'Group Type is required';
        if (!pri) error.pri = 'Visibility Type is required';
        if (previewImg) {
            if (!acceptedExtensions.includes(previewImg.split('.')[previewImg.split('.').length - 1])) error.previewImg = 'Image URL must end in .png, .jpg, or .jpeg';
        }

        setErrors(error);
    }, [location, name, about, type, pri, previewImg])


    const handleSubmit = (e) => {
        e.preventDefault();
        setAttemptedSubmit(true);

        if (Object.values(errors)[0]) return alert('Can not submit');


        const [city, state] = location.split(', ');
        setAttemptedSubmit(false);

        if (formType === "Create group") {
            const newGroupId = dispatch(
                newGroup({
                    name,
                    about,
                    type,
                    pri,
                    city,
                    state,
                    previewImg
                })
            ).then(newId => history.push(`/groups/${newId}`));
        } else if (formType === "Update group") {
            dispatch(
                editGroup(id, {
                    name,
                    about,
                    type,
                    pri,
                    city,
                    state,
                    previewImg
                })
            ).then(r => history.push(`/groups/${id}`));
        }

    }

    return (
        <div className='container'>
            <div className='group-form-container'>
            <form onSubmit={handleSubmit}>
                    {formType==="Create group"? (
                <div className='group-form-instructions'>
                    <p id='title' style={{margin: '0px', color: '#00525e'}}>START A NEW GROUP</p>
                    <p id='subtitle' style={{margin: '0px'}}>We'll walk you through a few steps to build your local community</p>
                </div>
                    ) : (
                <div className='group-form-instructions'>
                    <p id='title' style={{margin: '0px', color: '#00525e'}}>UPDATE YOUR GROUP'S INFORMATION</p>
                    <p id='subtitle' style={{margin: '0px'}}>We'll walk you through a few steps to update your group's information</p>
                </div>
                    )}

                <div className='group-form-set-location'>
                    <p id='title' style={{margin: '0px'}}>Set your group's location</p>
                    <p htmlFor='location' style={{margin: '0px'}}>Meetup groups meet locally, in person, and online. We'll connect you with people in your area, and more can join you online.</p>
                    <input
                    type="text"
                    id='location'
                    placeholder='City, STATE'
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    />
                    {attemptedSubmit && errors.location && (<div id='error'>{errors.location}</div>)}
                </div>
                <div className='group-form-set-name'>
                    <p id='title' style={{margin: '0px'}}>What will your group's name be?</p>
                    <p htmlFor='name' style={{margin: '0px'}}>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                    type="text"
                    id="name"
                    placeholder='What is your group name?'
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                    {attemptedSubmit && errors.name && (<div id='error'>{errors.name}</div>)}
                </div>
                <div className='group-form-set-about'>
                    <p id='title' style={{margin: '0px'}}>Describe the purpose of your group</p>
                    <p style={{margin: '0px'}}>People will see this when we promote your group, but you'll be able to add to it later, too.</p>

                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>

                    <textarea
                    id="about"
                    rows={6}
                    cols={36}
                    placeholder='Please write at least 30 characters'
                    style={{backgroundColor: '#e8f0fe', width: '300px'}}
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    ></textarea>
                    {attemptedSubmit && errors.about && (<div id='error'>{errors.about}</div>)}

                </div>
                <div className='group-form-final-sets'>
                    <p id='title' style={{margin: '0px'}}>Final steps...</p>
                    <p htmlFor='type' style={{margin: '0px'}}>Is this an in person or online group?</p>
                    <select
                    id='type'
                    style={{backgroundColor: '#e8f0fe'}}
                    value={type}
                    onChange={e => setType(e.target.value)}
                    >
                        <option value="">{`(select one)`}</option>
                        <option value="In Person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                    {attemptedSubmit && errors.type && (<div id='error'>{errors.type}</div>)}

                    <p htmlFor='pri' style={{margin: '0px'}}>Is this group private or public?</p>
                    <select
                    id='pri'
                    style={{backgroundColor: '#e8f0fe'}}
                    value={pri}
                    onChange={e => setPri(e.target.value)}
                    >
                        <option value="">{`(select one)`}</option>
                        <option value='true'>Private</option>
                        <option value='false'>Public</option>
                    </select>
                    {attemptedSubmit && errors.pri && (<div id='error'>{errors.pri}</div>)}

                    {formType === 'Update group' ? (<div>Update group image feature coming soon</div>) : (
                        <>
                            <p htmlFor='imgUrl' style={{margin: '0px'}}>Please add an image url for your group below:</p>
                            <input
                            type="text"
                            id='imgUrl'
                            style={{backgroundColor: '#e8f0fe', width: '300px'}}
                            placeholder='Image Url'
                            value={previewImg}
                            onChange={e => setPreviewImg(e.target.value)}
                            />
                            {attemptedSubmit && errors.previewImg && (<div id='error'>{errors.previewImg}</div>)}
                        </>
                    )}


                </div>
                <div className='group-form-buttons'>
                    <input className="group-form-submit-button" type="submit" value={formType} disabled={attemptedSubmit && Object.values(errors)[0] ? true : false} />
                </div>
            </form>

        </div>
        </div>

    );
}

export default GroupForm;
