import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class Head extends Component {
  state = {
    loggedout: false,
  };
  constructor(props) {
    super(props);
  }

  handleLogOut = (e) => {
    fetch("/api/logout", { credentials: "include" }).then(() => {
      sessionStorage.setItem("loggedIn", false);
      this.setState({
        loggedout: !this.state.loggedout,
      });
    });
  };

  render() {
    let isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn == false) {
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
    console.log(isLoggedIn);
    return (
      <div>
        {/* className="fixed-top" */}
        <header id="header">
          <div className="container d-flex align-items-center">
            <h1 className="logo mr-auto">
              <a href="index.html">DigiClinic</a>
            </h1>

            <nav className="nav-menu d-none d-lg-block">
              <ul>
                {/* <li className="active">
                  <a href="index.html">Home</a>
                </li> */}
                {/* <li className="drop-down">
                  <a href="">Drop Down</a>
                  <ul>
                    <li>
                      <a href="#">Drop Down 1</a>
                    </li>
                    <li className="drop-down">
                      <a href="#">Deep Drop Down</a>
                      <ul>
                        <li>
                          <a href="#">Deep Drop Down 1</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 2</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 3</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 4</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 5</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Drop Down 2</a>
                    </li>
                    <li>
                      <a href="#">Drop Down 3</a>
                    </li>
                    <li>
                      <a href="#">Drop Down 4</a>
                    </li>
                  </ul>
                </li> */}
                {isLoggedIn == "true" ? (
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={this.handleLogOut}
                    >
                      Log out
                    </a>
                  </li>
                ) : (
                  <li>
                    <Link to={"/login"}>Log In</Link>
                  </li>
                )}
                {isLoggedIn == "false" && (
                  <li>
                    <Link to={"/register"}>Register</Link>
                  </li>
                )}
              </ul>
            </nav>

            <a href="/PostBlog" className="get-started-btn scrollto">
              Add a Blog
            </a>
          </div>
        </header>
      </div>
    );
  }
}

export default Head;
