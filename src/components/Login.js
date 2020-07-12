import React from "react";
import axios from "axios";
import "../css/form.css";
import "./login.css";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generalErr: "",
      userId: "",
      userIdErr: "",
      password: "",
      passwordErr: "",
    };
  }

  updateUserId = (e) => {
    const userId = e.target.value;
    this.setState(() => ({
      userId,
      userIdErr: "",
    }));
  };
  updatePassword = (e) => {
    const password = e.target.value;
    this.setState(() => ({
      password,
      passwordErr: "",
    }));
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { userId, password } = this.state;
    let areErrs = false;
    if (userId.length < 8) {
      areErrs = true;
      this.setState(() => ({
        userIdErr: "User ID must have atleast 8 character",
      }));
    }
    if (password.length < 8) {
      areErrs = true;
      this.setState(() => ({
        passwordErr: "password must have atleast 8 latters",
      }));
    }
    if (!areErrs) {
      const user = {
        userId: this.state.userId,
        password: this.state.password,
      };
      axios
        .post("/api/login", user)
        .then((res) => {
          const data = res.data;
          if (data.err) {
            const err = {};
            const keys = Object.keys(data.err);
            for (let key of keys) {
              err[key] = data.err[key];
            }
            this.setState(() => ({
              ...err,
            }));
          } else {
            sessionStorage.setItem("loggedIn", true);
            if (this.props.location.state) {
              this.props.history.push(this.props.location.state);
            } else {
              this.props.history.push("/");
            }
          }
        })
        .catch((e) => {
          this.setState(() => ({
            generalErr: e.message,
          }));
        });
    }
  };
  render() {
    return (
      <div class="bg-gradient-primary">
        <div class="container">
          {/* <!-- Outer Row --> */}
          <div class="row justify-content-center">
            <div class="col-xl-10 col-lg-12 col-md-9">
              <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                  {/* <!-- Nested Row within Card Body --> */}
                  <div class="row">
                    <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div class="col-lg-6">
                      <div class="p-5">
                        <div class="text-center">
                          <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                        </div>

                        {this.state.generalErr && (
                          <div id="serverErr">{this.state.generalErr}</div>
                        )}
                        <form
                          class="user"
                          method="post"
                          noValidate={true}
                          onSubmit={this.handleSubmit}
                        >
                          <div className="form-group">
                            <input
                              type="text"
                              name="userId"
                              placeholder="Enter Username"
                              class="form-control form-control-user"
                              value={this.state.userId}
                              onChange={this.updateUserId}
                            />

                            {this.state.userIdErr && (
                              <div className="clientErr">
                                {this.state.userIdErr}
                              </div>
                            )}
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              name="password"
                              placeholder="Enter Password"
                              class="form-control form-control-user"
                              value={this.state.password}
                              onChange={this.updatePassword}
                            />

                            {this.state.passwordErr && (
                              <div className="clientErr">
                                {this.state.passwordErr}
                              </div>
                            )}
                          </div>
                          <div class="form-group">
                            <div class="custom-control custom-checkbox small">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customCheck"
                              />
                              <label
                                class="custom-control-label"
                                for="customCheck"
                              >
                                Remember Me
                              </label>
                            </div>
                          </div>
                          <button
                            class="btn login btn-primary btn-user btn-block"
                            id="logIn"
                            type="submit"
                          >
                            Log In
                          </button>
                          <hr />
                          <a class="btn btn-google btn-user btn-block">
                            <i class="fa fa-google fa-fw"></i> Login with Google
                          </a>
                          <a class="btn btn-facebook btn-user btn-block">
                            <i class="fa fa-facebook-f fa-fw"></i> Login with
                            Facebook
                          </a>
                        </form>
                        <hr />
                        <div class="text-center">
                          <a class="small" href="forgot-password.html">
                            Forgot Password?
                          </a>
                        </div>
                        <div class="text-center">
                          <a class="small" href="/register">
                            Create an Account!
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
