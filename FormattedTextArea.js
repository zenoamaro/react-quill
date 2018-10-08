import React from "react";
import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";

class FormattedTextarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "This is list<ul><li>one</li><li>two</li></ul>",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" }
          ],
          ["link", "image"]
        ]
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image"
      ]
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    return (
      <ReactQuill
        value={this.state.text}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        theme="snow"
        modules={this.state.modules}
        formats={this.state.formats}
      />
    );
  }
}

export default FormattedTextarea;
