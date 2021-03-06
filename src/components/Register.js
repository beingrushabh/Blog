import React from "react";
import axios from "axios";
import "../css/form.css";
import "./login.css";
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generalErr: "",
      username: "",
      usernameErr: "",
      userId: "",
      userIdErr: "",
      email: "",
      emailErr: "",
      password: "",
      passwordErr: "",
      confirmPassword: "",
      confirmPasswordErr: "",
      tagline: "",
      taglineErr: "",
      filename: "",
      filedata: {},
      fileErr: ""
    };
  }
  updateUserName = (e) => {
    const username = e.target.value;
    this.setState(() => ({
      username,
      usernameErr: "",
    }));
  };
  updateUserId = (e) => {
    const userId = e.target.value;
    this.setState(() => ({
      userId,
      userIdErr: "",
    }));
  };
  updateEmail = (e) => {
    const email = e.target.value;
    this.setState(() => ({
      email,
      emailErr: "",
    }));
  };
  updateTagLine = (e)=>{
    const tagline = e.target.value;
    this.setState(()=>({
      tagline
    }));
  }
  updatePassword = (e) => {
    const password = e.target.value;
    this.setState(() => ({
      password,
      passwordErr: "",
    }));
  };
  updateConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    this.setState(() => ({
      confirmPassword,
      confirmPasswordErr: "",
    }));
  };
  handleFileChange = (e) =>{
    const filedata = e.target.files[0];
    const filename = e.target.value;
    this.setState(()=>({
      filename,filedata,fileErr : ""
    }));
  }
  handleSubmit = (e) => {
    const target = e.target;
    e.preventDefault();
    let areErrs = false;
    const { username, userId, email, password, confirmPassword,filename } = this.state;
    if (username.length < 8) {
      areErrs = true;
      this.setState(() => ({
        usernameErr: "username must have atleast 8 characters",
      }));
    }
    if (userId.length < 8) {
      areErrs = true;
      this.setState(() => ({
        userIdErr: "userId must have atleast 8 characters",
      }));
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email)) {
      areErrs = true;
      this.setState(() => ({
        emailErr: "email address is invalid!!",
      }));
    }
    if (password.length < 8) {
      areErrs = true;
      this.setState(() => ({
        passwordErr: "password must have atlest 8 letters",
      }));
    }

    if (confirmPassword !== password) {
      areErrs = true;
      this.setState(() => ({
        confirmPasswordErr: "both password field should match",
      }));
    }

    if(filename){

      const extensions = [".jpg",".jpeg",".png"];
      const fileExtension = filename.substr(filename.lastIndexOf("."));
      if(extensions.indexOf(fileExtension)===-1){
        areErrs = true;
        this.setState(()=>({
          fileErr : "invalid file"
        }));
      }
    }

    if (!areErrs) {
      const { username, userId, email, password,tagline,filename,filedata } = this.state;
      // console.log(username, userId, email, password,tagline,filename,filedata);
      // console.log(target);
      const formData = new FormData();
      formData.append('filename',filedata);
      formData.append('username',username);
      formData.append('userId',userId);
      formData.append('email',email);
      formData.append('password',password);
      formData.append('tagline',tagline);
      // formData.append('filename',filename);
       const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    console.log(formData);
      axios
        .post("/api/register", formData,config)
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
            this.props.history.push("/login");
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
      //   <div id="register_form">
      <div class="bg-gradient-primary">
        <div class="container">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              {/* <!-- Nested Row within Card Body --> */}
              <div class="row">
                <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
                <div class="col-lg-7">
                  <div class="p-5">
                    <div class="text-center">
                      <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                    </div>

                    {this.state.generalErr && (
                      <div id="serverErr">{this.state.generalErr}</div>
                    )}
                    <form
                      method="post"
                      encType='multipart/form-data'
                      noValidate={true}
                      class="user"
                      onSubmit={this.handleSubmit}
                    >
                      <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="text"
                            class="form-control form-control-user"
                            name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.updateUserName}
                          />

                          {this.state.usernameErr && (
                            <div className="clientErr">
                              {this.state.usernameErr}
                            </div>
                          )}
                        </div>
                        <div class="col-sm-6">
                          <input
                            type="text"
                            class="form-control form-control-user"
                            name="userid"
                            placeholder="Unique UserId"
                            value={this.state.userId}
                            onChange={this.updateUserId}
                          />
                          {this.state.userIdErr && (
                            <div className="clientErr">
                              {this.state.userIdErr}
                            </div>
                          )}
                        </div>
                      </div>
                      <div class="form-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Id"
                          class="form-control form-control-user"
                          value={this.state.email}
                          onChange={this.updateEmail}
                        />

                        {this.state.emailErr && (
                          <div className="clientErr">{this.state.emailErr}</div>
                        )}
                      </div>
                      <div className='form-group'>
                        <textarea
                            name='tagline'
                            placeholder='enter your favourite tagline'
                            className='form-control form-control-user textarea'
                            value={this.state.tagline}
                            onChange={this.updateTagLine}
                        />

                        {this.state.taglineErr && (
                            <div className='clientErr'>{this.state.taglineErr}</div>
                        )}
                      </div>
                      <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="password"
                            name="username"
                            placeholder="Set Password"
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
                        <div class="col-sm-6">
                          <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            class="form-control form-control-user"
                            value={this.state.confirmPassword}
                            onChange={this.updateConfirmPassword}
                          />

                          {this.state.confirmPasswordErr && (
                            <div className="clientErr">
                              {this.state.confirmPasswordErr}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                            type="file"
                            name="filename"
                            placeholder="profile Pic"
                            value={this.state.filename}
                            onChange={this.handleFileChange}
                        />

                        {this.state.fileErr && (
                            <div className="clientErr">{this.state.fileErr}</div>
                        )}
                      </div>
                      <button
                        type="submit"
                        class="btn register btn-primary btn-user btn-block"
                        id="register"
                      >
                        Register
                      </button>
                      <hr />
                      <a
                        href="index.html"
                        class="btn btn-google btn-user btn-block"
                      >
                        <i class="fa fa-google fa-fw"></i> Register with Google
                      </a>
                      <a
                        href="index.html"
                        class="btn btn-facebook btn-user btn-block"
                      >
                        <i class="fa fa-facebook-f fa-fw"></i> Register with
                        Facebook
                      </a>
                    </form>
                    <hr />
                    <div class="text-center">
                      <a class="small" href="/login">
                        Already have an account? Login !
                      </a>
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

export default RegisterForm;
