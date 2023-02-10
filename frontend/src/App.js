import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      restoreUser()
    )
  }, [])

  return (
    <Switch>
      <Route path="/login">
        <LoginFormPage />
      </Route>
    </Switch>
  );
}

export default App;
