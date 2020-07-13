import React, { Component } from "react";
import "./AuthorWise.css";
import Head from "../header";
import PostBlog from "./PostBlog";
import axios from "axios";
import img from "../121436.jpg";
class AuthorWise extends Component {
  state = {
    postBlog: false,
    author: "rushabh07",
    blogs: [],
    user: [],
    cover: "../121436.jpg",
  };

  PostBlog() {
    this.setState({
      postBlog: true,
    });
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/api/blogs`).then((data) =>
      this.setState({
        blogs: data.data,
      })
    );

    // axios.get(`/api/users/userId/${this.props.id}`).then((data) =>
    //   this.setState({
    //     user: data.data[0],
    //   })
    // );
  }

  render() {
    console.log(this.state.user);
    console.log(this.state.blogs);
    const AuthorBlogs = this.state.blogs.map((instance) => {
      return (
        <BlogInstance
          id={instance._id}
          author={instance.author}
          title={instance.title}
          jist={instance.jist}
          date={instance.date}
        />
      );
    });
    return (
      <div>
        <Head />
        <header
          className="masthead Hearder"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
              <button className="btn btn-outline-primary edit-cover">
                {/* <i className="fa fa-pen-fancy"></i> */}
                Edit Cover
              </button>
              <div className="col-lg-8 col-md-10 mx-auto">
                <div className="site-heading">
                  <button className="btn btn-outline-primary edit-cover">
                    Edit Info
                  </button>
                  <h1
                    style={{ textShadow: "3px 3px 5px rgba(255,255,255,0.2)" }}
                  >
                    {this.state.user.username}
                  </h1>
                  <span className="subheading">Let the story begin..</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content  */}

        <div classNameName="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 mx-auto">
              {AuthorBlogs}
              {/* Pager  */}
              <div className="clearfix">
                <a className="btn btn-primary float-right" href="#">
                  Older Posts &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr />
        {/*  Footer */}
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 mx-auto">
                <ul className="list-inline text-center">
                  <li className="list-inline-item">
                    <a href="#">
                      <span className="fa-stack fa-lg">
                        <i className="fa fa-circle fa-stack-2x"></i>
                        <i className="fa fa-twitter fa-stack-1x fa-inverse"></i>
                      </span>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <span className="fa-stack fa-lg">
                        <i className="fa fa-circle fa-stack-2x"></i>
                        <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
                      </span>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <span className="fa-stack fa-lg">
                        <i className="fa fa-circle fa-stack-2x"></i>
                        <i className="fa fa-github fa-stack-1x fa-inverse"></i>
                      </span>
                    </a>
                  </li>
                </ul>
                <p className="copyright text-muted">
                  Copyright &copy; Your Website 2020
                </p>
              </div>
            </div>
          </div>
        </footer>
        {this.state.postBlog && (
          <PostBlog
            Back={() =>
              this.setState({
                postBlog: false,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default AuthorWise;

export class BlogInstance extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="post-preview">
          <a href={`/${this.props.author}/${this.props.id}`}>
            <h2 className="post-title">{this.props.title}</h2>
            <h3 className="post-subtitle">{this.props.jist}</h3>
          </a>
          <p className="post-meta">
            {/* Posted by &nbsp;
            <a href="#">{this.props.author}</a>
            <br /> */}
            {this.props.date}
          </p>
        </div>
        <hr />
      </div>
    );
  }
}
