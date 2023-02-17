import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as groupActions from "./store/groups";
import * as eventActions from "./store/events";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsListPage from "./components/GroupsListPage";
import GroupDetailsPage from "./components/GroupDetailsPage";
import StartGroupForm from "./components/GroupForm/StartGroupForm";
import UpdateGroupForm from "./components/GroupForm/UpdateGroupForm";
import EventsListPage from "./components/EventsListPage";
import EventDetailsPage from "./components/EventDetailsPage";
import CreateEventForm from "./components/EventForm/CreateEventForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // add logic to restore the group state and event state
    dispatch(groupActions.restoreGroups());
    dispatch(eventActions.restoreEvents());
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/groups">
            <GroupsListPage />
          </Route>
          <Route path="/groups/new">
            <StartGroupForm />
          </Route>
          <Route exact path="/groups/:id">
            <GroupDetailsPage />
          </Route>
          <Route path="/groups/:id/edit">
            <UpdateGroupForm />
          </Route>
          <Route exact path="/events">
            <EventsListPage />
          </Route>
          <Route path="events/:id">
            <EventDetailsPage />
          </Route>
          <Route path="/groups/:id/events/new">
            <CreateEventForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
