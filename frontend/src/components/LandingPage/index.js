import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton'
import SignupFormModal from '../SignupFormModal';
import './LandingPage.css';

function LandingPage() {

    const user = useSelector(state => state.session.user);

    return (
            <div className='landing-section-container'>
                <section className='landing-section-1'>
                    <div className='landing-1-left'>
                        <h1>The people platform— Where interests become friendships</h1>
                        <p id='intro-text'>Bacon ipsum dolor amet ham hock burgdoggen strip steak, swine sausage chicken kielbasa t-bone porchetta. Biltong buffalo pig shankle sausage chislic beef ribs pork chop chuck ribeye boudin turducken sirloin t-bone jerky. Beef ribs fatback sausage frankfurter biltong ground round swine drumstick pastrami chislic picanha pig bacon tongue. T-bone sirloin tongue beef bresaola meatloaf. Capicola ground round brisket, cow ham hock alcatra beef buffalo strip steak leberkas kielbasa drumstick. Pork pork loin leberkas chicken beef, andouille shank ball tip.</p>
                    </div>
                    <div className='landing-1-right'>
                        <img
                         src='https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                         alt='meeting infographic'
                         id='info-img'
                         />
                    </div>
                </section>
                <section className='landing-section-2'>
                    <div className='landing-2'>
                        <h2>How Meetup works</h2>
                        <p id='subtitle-caption'>Buffalo porchetta kevin kielbasa meatloaf venison tail sausage ham. Chislic tenderloin short loin, kevin sausage frankfurter rump andouille.</p>
                    </div>
                </section>
                <section className='landing-section-3'>
                    <div className='landing-3-card'>
                        <img
                        src="https://images.unsplash.com/photo-1498805983167-a523078d762c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=911&q=80"
                        alt="high five"
                        style={{height: '150px', width: '250px'}}
                         />
                        <NavLink to="/groups">See all groups</NavLink>
                        <p className='card-text'>Doner flank jerky, kielbasa landjaeger ham boudin sirloin cupim biltong porchetta pancetta tongue pig. Brisket pork belly drumstick beef kielbasa meatball. Boudin kielbasa meatloaf pancetta tri-tip landjaeger. Pork shoulder spare ribs doner hamburger. Prosciutto ham hock pork belly tongue alcatra, venison sausage hamburger ribeye. Spare ribs pork chop ball tip jerky. Picanha shank meatloaf, ribeye corned beef kevin sausage fatback frankfurter cupim tri-tip pig salami chislic shankle.</p>
                    </div>
                    <div className='landing-3-card'>
                        <img
                        src="https://images.unsplash.com/photo-1587573088697-b4fa10460683?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80"
                        alt="event booking"
                        style={{height: '150px', width: '250px'}}
                        />
                        <NavLink to="/events">Find an event</NavLink>
                        <p className='card-text'> Ham tri-tip andouille ribeye shankle salami. Drumstick swine ground round, porchetta pork loin short ribs boudin tenderloin hamburger andouille pancetta ham hock cow kevin</p>
                    </div>
                    <div className='landing-3-card'>
                        <img
                        src="https://images.unsplash.com/photo-1622037022824-0c71d511ef3c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                        alt="group"
                        style={{height: '150px', width: '250px'}}
                        />
                        {
                            user ? (
                                <NavLink to="/groups/new">Start a new group</NavLink>
                            ) : (
                                <p id='no-user-new-group'>Start a new group</p>
                            )
                        }

                        <p className='card-text'>Venison andouille spare ribs sirloin short ribs shank ham tongue meatloaf short loin corned beef cupim. Kevin t-bone shankle kielbasa burgdoggen flank. Strip steak spare ribs rump filet mignon shank jerky. Leberkas doner short loin flank. Drumstick short loin pork belly, biltong andouille rump jowl flank venison.</p>
                    </div>
                </section>
                <section className='landing-section-4'>
                    <OpenModalButton
                    buttonText="Join Meetup"
                    modalComponent={<SignupFormModal />}
                    />
                </section>
            </div>
        )
}

export default LandingPage;
