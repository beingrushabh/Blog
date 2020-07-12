import React, { Component } from "react";
import "./PostBlog.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import axios from "axios";
import Head from "../header";
import { Redirect } from "react-router";
class PostBlog extends Component {
  state = {
    editorHtml: "",
    theme: "snow",
    title: "",
    jist: "",
    author: "Rushabh",
    published: false,
  };

  handleChange(html) {
    this.setState({ editorHtml: html });
  }

  handleThemeChange(newTheme) {
    if (newTheme === "core") newTheme = null;
    this.setState({ theme: newTheme });
  }
  Submit(event) {
    event.preventDefault();
    const params = {
      title: this.state.title,
      content: this.state.editorHtml,
      jist: this.state.jist,
      author: this.state.author,
    };
    axios
      .post("http://localhost:5000/api/blogs/", params)
      .then((data) => {
        this.setState({
          published: !this.state.published,
        });
      })
      .catch((error) => alert("error, try again"));
  }
  UpdateTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }
  UpdateJist(event) {
    this.setState({
      jist: event.target.value,
    });
  }
  Clear(event) {
    event.preventDefault();
    this.setState({
      title: "",
      editorHtml: "",
    });
  }
  render() {
    if (this.state.published) {
      return (
        <Redirect
          to={{
            pathname: `/${this.state.author}`,
          }}
        />
      );
    }
    return (
      <div>
        <div className="container">
          <form className="postBlog popup" onSubmit={this.Submit.bind(this)}>
            <h2>Add Post</h2>
            <hr />
            <br />
            <div class="form-group">
              <label for="title">
                Title <span class="require">*</span>
              </label>
              <input
                type="text"
                value={this.state.title}
                onChange={this.UpdateTitle.bind(this)}
                class="form-control"
                name="title"
              />
            </div>
            <div class="form-group">
              <label for="title">
                Whats it about ? <span class="require">*</span>
              </label>
              <input
                type="text"
                value={this.state.jist}
                onChange={this.UpdateJist.bind(this)}
                class="form-control"
                name="title"
              />
            </div>
            <div class="form-group">
              <label for="title">Content</label>
              <ReactQuill
                theme={this.state.theme}
                onChange={this.handleChange.bind(this)}
                value={this.state.editorHtml}
                modules={PostBlog.modules}
                formats={PostBlog.formats}
                bounds={".app"}
              />
            </div>

            <div className="themeSwitcher">
              <label>Theme:</label> &nbsp;
              <select onChange={(e) => this.handleThemeChange(e.target.value)}>
                <option value="snow">Snow</option>
                <option value="bubble">Bubble</option>
              </select>
            </div>
            <button
              className="submit btn btn-danger"
              onClick={this.Clear.bind(this)}
            >
              Clear
            </button>
            <button className="submit btn btn-success" type="submit">
              Publish
            </button>
          </form>
        </div>
        <div className="container">
          For testing
          {/* <div dangerouslySetInnerHTML={{ __html: this.state.editorHtml }} /> */}
          {this.state.editorHtml}
        </div>
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
PostBlog.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "hr"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
PostBlog.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

/*
 * PropType validation
 */

export default PostBlog;
