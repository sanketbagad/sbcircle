import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Navbar from "../src/components/layout/Navbar"
import Landing from "../src/components/layout/Landing"
import Login from "../src/components/auth/Login"
import Register from "../src/components/auth/Register"
import CreateProfile from "../src/components/profile-form/CreateProfile"
import EditProfile from "../src/components/profile-form/EditProfile"
import AddExperience from "../src/components/profile-form/AddExperience"
import AddEducation from "../src/components/profile-form/AddEducation"
import Alert from "../src/components/layout/Alert"
import PrivateRoute from "../src/components/routing/PrivateRoute"
import Dashboard from "../src/components/dashboard/Dashboard"
import { loadUser } from "./actions/auth"
import Profile from "../src/components/profile/Profile"
import Posts from "../src/components/posts/Posts"
import './App.css';
import { Provider } from "react-redux"
import store from "./store"
import setAuthToken from "./utils/setAuthToken"
import Profiles from "../src/components/profiles/Profiles"
import Post from "./components/post/Post"

if(localStorage.token) {
  setAuthToken(localStorage.token)
}
const App = () => {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store} >
    <Router>
    <>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profile/:id" component={Profile} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/create-profile" component={CreateProfile} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
          <PrivateRoute exact path="/add-experience" component={AddExperience} />
          <PrivateRoute exact path="/add-education" component={AddEducation} />
          <PrivateRoute exact path="/posts" component={Posts} />
          <PrivateRoute exact path="/posts/:id" component={Post} />
        </Switch>
      </section>   
    </>
    </Router>
    </Provider>
  );
}

export default App;
