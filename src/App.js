import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthorWise from "./components/Blogs/AuthorWise";
import TheBlog from "./components/Blogs/TheBlog";
import News from "./components/News/News";
import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import LogOut from "./components/LogOut";
import PostBlog from "./components/Blogs/PostBlog";
import ProtactedRoute from "./components/ProtactedRoute";

import axios from "axios";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(async () => {
    try {
      const data = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(data.data);
    } catch (e) {
      throw new Error(e);
    }
  }, []);

  useEffect(async () => {
    try {
      const data = await axios.get("http://localhost:5000/api/users");
      setUsers(data.data);
    } catch (e) {
      throw new Error(e);
    }
  }, []);
  console.log(users);
  const blogUrls = blogs.map((instance) => {
    console.log(instance);
    return (
      <ProtactedRoute
        path={`/${instance.author}/${instance._id}`}
        id={instance._id}
        component={TheBlog}
      />
    );
  });

  const userUrls = users.map((instance) => {
    return (
      <ProtactedRoute
        path={`/${instance.userId}`}
        id={instance._id}
        component={AuthorWise}
      />
    );
  });
  return (
    <div className="App">
      <Router>
        <Switch>
          {blogUrls}
          {userUrls}
          <ProtactedRoute path="/PostBlog" component={PostBlog} />
          <ProtactedRoute path="/News" component={News} />
          <ProtactedRoute path="/Blog" component={TheBlog} />
          <ProtactedRoute path="/Blogs" component={AuthorWise} />
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/logout" component={LogOut} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
