import React, { Component } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      keywords: "",
      selectKeyWords: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderKeywords = this.renderKeywords.bind(this);
    this.selectKeyWord = this.selectKeyWord.bind(this);
  }

  handleChange(event) {
    this.setState({ url: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    var url = this.state.url;
    const res = await axios.get("/keywords/url", {
      params: {
        link: url
      }
    });
    var keywordArray = res.data;
    this.setState({ keywords: keywordArray });
  }

  // <a href={`https://www.google.ca/search?q=${keyword}`}>        </a>
  selectKeyWord(event) {
    this.setState({
      selectKeyWords: [...this.state.selectKeyWords, event.target.value]
    });
    console.log(this.state.selectKeyWords);
  }

  renderKeywords() {
    if (this.state.keywords) {
      var keywords = this.state.keywords.map(function(keyword, i) {
        return (
          <li key={i}>
            <button value={keyword} onClick={this.selectKeyWord}>
              {keyword}
            </button>
          </li>
        );
      }, this);
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
              value={this.state.url}
              name="name"
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ReactPlayer url={this.state.url} controls={true} height={56} playing />
        {this.renderKeywords()}
      </div>
    );
  }
}

export default Player;
