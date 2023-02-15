import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';


function GroupForm({ group, formType }) {
    const [location, setLocation] = useState(group.location);
    const [name, setName] = useState(group.name);
    const [about, setAbout] = useState(group.about);
    const [type, setType] = useState(group.type);
    const [pri, setPri] = useState(group.pri);
    const [previewImg, setPreviewImg] = useState(group.previewImg);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className='group-form-container'>
            <form>
                    {formType==="CREATE"? (
                <div className='group-form-instructions'>
                    <h3>BECOME AN ORGANIZER</h3>
                    <h2>We'll walk you through a few steps to build your local community</h2>
                </div>
                    ) : (
                <div className='group-form-instructions'>
                    <h3>UPDATE YOUR GROUP'S INFORMATION</h3>
                    <h2>We'll walk you through a few steps to update your group's information</h2>
                </div>
                    )}

                <div className='group-form-set-location'>
                    <h2>First, set your group's location</h2>
                    <p htmlFor='location'>Meetup groups meet locally, in person, and online. We'll connect you with people in your area, and more can join you online.</p>
                    <input
                    type="text"
                    id='location'
                    placeholder='City, STATE'
                    />
                </div>
                <div className='group-form-set-name'>
                    <h2>What will your group's name be?</h2>
                    <p htmlFor='name'>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                    type="text"
                    id="name"
                    placeholder='What is your group name?'
                    />
                </div>
                <div className='group-form-set-about'>
                    <h2>Now describe what your group will be about</h2>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>

                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>

                    <textarea id="about" placeholder='Please write at least 30 characters'></textarea>

                </div>
                <div className='group-form-final-sets'>
                    <h2>Final steps...</h2>
                    <p htmlFor='type'>Is this an in person or online group?</p>
                    <select id='type'>
                        <option value="">{`(select one)`}</option>
                        <option value="In Person">In Person</option>
                        <option value="Online">Online</option>
                    </select>

                    <p htmlFor='pri'>Is this group private or public?</p>
                    <select id='pri'>
                        <option value="">{`(select one)`}</option>
                        <option value="true">Private</option>
                        <option value="false">Public</option>
                    </select>
                    <p htmlFor='imgUrl'>Please add an image url for your group below:</p>
                    <input
                    type="text"
                    id='imgUrl'
                    placeholder='Image Url'
                    />
                </div>
                <div>
                    <button onSubmit={handleSubmit}>Create group</button>
                </div>
            </form>

        </div>
    );
}

export default GroupForm;
