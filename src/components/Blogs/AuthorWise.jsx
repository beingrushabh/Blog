import React, { Component } from "react";
import "./AuthorWise.css";
import Head from "../header";
import PostBlog from "./PostBlog";
import axios from "axios";
import img from "../121436.jpg";
class AuthorWise extends Component {
  state = {
    editTagLineStatus : false,
    userId : "",
    tagline : "",
    oldtagline : "",
    updateProfilePending : false,
    updateTagLinePending : false,
    postBlog: false,
    author: "rushabh07",
    blogs: [],
    cover: "../121436.jpg",
    file : {},
    newCoverReady: false,
    newCoverUrl: "",
    newCover: "",
    profilePicErr : "",
    tagLineErr : ""
  };

  PostBlog() {
    this.setState({
      postBlog: true,
    });
  }

  componentDidMount() {
    axios.get("/api/users/user-data").then((res)=>{
      const {userId,tagline,filename} = res.data;
      this.setState(()=>({
        tagline,userId,cover : filename
      }));
    }).catch((err)=>{
      console.log(err);
    });
    this.setState(()=>({
      cover : img
    }));
    axios
      .get(`http://localhost:5000/api/blogs`)
      .then((data) => {
        this.setState({
          blogs: data.data,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  handleClick = ()=>{
    document.getElementById("upload_file").click();
  }

  handleFile = (e)=>{
    const files = e.target.files;
    if(files && files[0]){
      const newFile = files[0];
      const extensions = [".jpeg",".jpg",".png"];
      const fileExtension = newFile.name.substr(newFile.name.lastIndexOf("."));
      if(extensions.indexOf(fileExtension)===-1){
        this.setState(()=>({
          newCoverReady : false,
          newCover : '',
          newCoverUrl : '',
          profilePicErr : 'Invalid Image!!'
        }));
        setTimeout(()=>{
          this.setState(({
            profilePicErr : ""
          }));
        },1500);
        return ;
      }
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.addEventListener('load',(e)=>{
        const newCover = e.target.result;
        this.setState(()=>({
          newCover,
            newCoverUrl: newFile.name,
          newCoverReady : true,
          file : newFile
        }));
      });
    }
  }

  handleSubmit = async(e)=>{
    e.preventDefault();
    const latestProfile = this.state.newCover;
    this.setState(()=>({
      newCoverReady : false,
      newCover : "",
      newCoverUrl : "",
       updateProfilePending : true
    }));

    const formData = new FormData();
    formData.append('filename',this.state.file);

    const config = {
      headers: {
            'content-type': 'multipart/form-data'
        }
    }

    try {
      const res = await axios.post('/api/users/update-profile-pic', formData, config);
      const {status} = res.data;
      if (status === 'success') {
        this.setState((prevState) => ({
          cover: latestProfile,
          updateProfilePending: false
        }));
      } else {
        throw new Error('unable to update profile pic');
      }
    }
    catch(e){
      this.setState(()=>({
        profilePicErr : e.message,
        newCover : "",
        updateProfilePending : false
      }));
      setTimeout(()=>{
      this.setState(()=>({
        profilePicErr : ""
      }));
    },1000);
    }
  }

  handleReset = ()=>{
    this.setState(()=>({
      newCoverReady : false,
      newCover : '',
      newCoverUrl : '',
    }));
  }

  enableEdit = ()=>{
    this.setState(()=>({
      editTagLineStatus : true
    }));
  }

  handleChange = (e)=>{
    const value = e.target.value;
    if(value===(this.state.tagline + "\n"))
      return;
    e.target.style.height = "36px";
    e.target.style.height = e.target.scrollHeight + "px";
    this.setState(()=>({
      tagline : value
    }));
  }

  updateTagLine = async()=>{
    this.setState(()=>({
      updateTagLinePending : true,
    }));
    const data = {tagline : this.state.tagline}
    try {
      const res = await axios.post("/api/users/update-tagline", data);
      const {status} = res.data;
      if (status !== 'success') {
        throw new Error("Unable to update tagline");
      }else{
        this.setState((prevstate)=>({
          oldtagline : prevstate.tagline
        }));
      }
    }
    catch(e){
      this.setState((prevstate)=>({
          tagLineErr : "Unable to update tagline",
          tagline : prevstate.oldtagline
        }));
      setTimeout(()=>{
        this.setState(()=>({
          tagLineErr : ""
        }));
      },1000);
    }
    finally {
      this.setState(() => ({
          updateTagLinePending: false,
          editTagLineStatus: false
        }));
    }
    // setTimeout(()=>{
    //   this.setState(()=>({
    //
    //
    //   }));
    // },2000);
  }

  render() {
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
        <div id='opaque_background'
             style={{
               "display" : this.state.newCoverReady?"block":""
             }}
        ></div>
        <Head />
        <div id='newUrl'>{this.state.newCoverUrl}</div>
        <figure id='profile_info'>
          <div id='profile_img_container'>
            <img src={`${this.state.cover}`} alt='profile' id='profile_img'/>
            <div id='update_profile_img_option'
                 onClick={this.handleClick}
                 style={{
                   "display" : (this.state.updateProfilePending || this.state.profilePicErr)?"none":""
                 }}
            >
                <i className='fa fa-camera'></i>
                <span>Update Profile Pic</span>
            </div>
            <div
                id='loader_container'
                style={{
                  "display" : this.state.updateProfilePending?"":"none"
                }}
            >
              <div className='loader'></div>
            </div>
            <figure id='new_profile' style={{
              "visibility":this.state.newCoverReady?"visible":""
            }}>
              <img src={this.state.newCoverReady?`${this.state.newCover}`:""} alt='new_profile' id='new_profile_img'/>
              <figcaption>
                <form method='post' onSubmit={this.handleSubmit} id='update_img_form'>
                  <input type='file' id='upload_file' onChange={this.handleFile} value='' accept='image/*'/>
                  <button type='submit' className='update_img_form_field'>Upload</button>
                  <button type='reset' className='update_img_form_field' onClick={this.handleReset}>Cancel</button>
                </form>
              </figcaption>
            </figure>
          </div>
          {this.state.profilePicErr && <div className='err'>{this.state.profilePicErr}</div>}
          {!this.state.newCoverReady &&
          <figcaption id='tagline_container'>
            {!this.state.editTagLineStatus &&
                <div>
                  <div id='user_id'>{this.state.userId}</div>
                  <div id='display_tagline'>
                    {this.state.tagline}
                    <span onClick={this.enableEdit}><i className="fas fa-pen"></i></span>
                  </div>
                </div>}
            {this.state.editTagLineStatus &&
                <div id='edit_tagline'>
                  <textarea
                         className='tagline_full'
                         name='tagline'
                         value={this.state.tagline}
                         onChange={this.handleChange}
                         onKeyPress={(e)=>{if(e.key==='Enter'){
                           this.updateTagLine();
                         }}}
                  />
                  {!this.state.updateTagLinePending &&
                  <span onClick={this.updateTagLine}><i className='fa fa-check'></i></span>}
                  {this.state.updateTagLinePending && <div className='loader loader2'></div> }
                </div> }
            {this.state.tagLineErr && <div className='err'>{this.state.tagLineErr}</div> }
          </figcaption> }

        </figure>
        {/*<header*/}
        {/*  className="masthead Hearder"*/}
        {/*  style={{ backgroundImage: `url(${img})` }}*/}
        {/*>*/}
        {/*  <div className="overlay"></div>*/}
        {/*  <div className="container">*/}
        {/*    <div className="row">*/}
        {/*      <button className="btn btn-outline-primary edit-cover">*/}
        {/*        /!* <i className="fa fa-pen-fancy"></i> *!/*/}
        {/*        Edit Cover*/}
        {/*      </button>*/}
        {/*      <div className="col-lg-8 col-md-10 mx-auto">*/}
        {/*        <div className="site-heading">*/}
        {/*          <button className="btn btn-outline-primary edit-cover">*/}
        {/*            Edit Info*/}
        {/*          </button>*/}
        {/*          <h1*/}
        {/*            style={{ textShadow: "3px 3px 5px rgba(255,255,255,0.2)" }}*/}
        {/*          >*/}
        {/*            {this.state.author}*/}
        {/*          </h1>*/}
        {/*          <span className="subheading">Let the story begin..</span>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</header>*/}
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
