import React, { Component } from "react";
import Axios from "axios";

class MiniProfile extends Component {
  state = {
    userId: this.props.userId,
    user: [],
  };

  async componentDidUpdate(prevProp, prevState) {
    if (prevProp.userId != this.props.userId) {
      var data = await Axios.get(`/api/users/userId/${this.props.userId}`);
      this.setState({
        user: data.data[0],
      });
      console.log(this.state.user);
    }
  }
  async componentWillMount() {
    // var sessionId = sessionStorage.getItem("_id");
    // var data = await Axios.get(`/api/session/${sessionId}`);
    // this.setState({
    //   userId: data.data.session.passport.user,
    // });
    var data = await Axios.get(`/api/users/userId/${this.props.userId}`);
    this.setState({
      user: data.data,
    });
  }

  render() {
    if (this.state.user == undefined) {
      return <div>loading..</div>;
    }
    console.log(this.props.userId);
    return (
      <div>
        <div class="sidebar-box">
          <div class="bio text-center">
            <img
              src={this.state.user.profilePic}
              alt="Profile pic"
              class="img-fluid mb-5"
            />
            <div class="bio-body">
              <h2>{this.state.user.username}</h2>
              <p class="mb-4">{this.state.user.userInfo}</p>
              <p>
                <a
                  href={`/${this.state.user.userId}`}
                  class="btn btn-primary btn-sm rounded px-4 py-2"
                >
                  My Profile
                </a>
              </p>
              <p class="social">
                <a href="#" class="p-2">
                  <span class="fa fa-facebook"></span>
                </a>
                <a href="#" class="p-2">
                  <span class="fa fa-twitter"></span>
                </a>
                <a href="#" class="p-2">
                  <span class="fa fa-instagram"></span>
                </a>
                <a href="#" class="p-2">
                  <span class="fa fa-youtube-play"></span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MiniProfile;
