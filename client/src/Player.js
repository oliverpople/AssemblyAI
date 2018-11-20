import React, { Component } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      keywords: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // async componentDidMount() {
  //   const res = await axios.get("/keywords?id=bbcminute.mp3");
  //   var keywordArray = res.data;
  //   this.setState({ keywords: keywordArray });
  // }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    var url = this.state.value;
    const res = await axios.get("/keywords/url", {
      params: {
        link: url
      }
    });
    var keywordArray = res.data;
    this.setState({ keywords: keywordArray });
  }

  renderKeywords() {
    if (this.state.keywords) {
      var keywords = this.state.keywords.map(function(keyword, i) {
        return (
          <li key={i}>
            <a href={`https://www.google.ca/search?q=${keyword}`}>{keyword}</a>
          </li>
        );
      });
      return keywords;
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            URL:
            <input
              type="text"
              value={this.state.value}
              name="name"
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ReactPlayer
          url={this.state.value}
          controls={true}
          height={56}
          playing
        />
        {this.renderKeywords()}
      </div>
    );
  }
}

export default Player;
