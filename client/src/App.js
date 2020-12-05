import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LandingPage from './components/layout/LandingPage';
import Navbar from './components/layout/Navbar';
// Redux
import store from './store';
import { Provider } from 'react-redux';
import Alerts from './components/layout/Alerts';
import { loadUser } from './actions/auth';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import createProfleForm from './components/profile-forms/createProfleForm';
import EditProfileForm from './components/profile-forms/EditProfileForm';
import AddEducation from './components/profile-forms/AddEducation';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={LandingPage} />
          <section className='container'>
            <Alerts />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={createProfleForm}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfileForm}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
