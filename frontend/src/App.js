import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsListPage from "./components/GroupsListPage";
import GroupDetailsPage from "./components/GroupDetailsPage";
import StartGroupForm from "./components/GroupForm/StartGroupForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
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
          <Route path="/groups/:id">
            <GroupDetailsPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
