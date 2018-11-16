import React, { Component } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

class Player extends Component {
  state = { keywords: "" };

  async componentDidMount() {
    const res = await axios.get("/keywords?id=bbcminute.mp3");
    var keywordArray = res.data;
    //clean up array
    console.log(keywordArray);
    this.setState({ keywords: keywordArray });
  }

  renderKeywords() {
    if (this.state.keywords) {
      var keywords = this.state.keywords.map(function(keyword, i) {
        console.log("test");
        return <li key={i}>{keyword}</li>;
      });
      return keywords;
    }
  }

  render() {
    return (
      <div>
        <ReactPlayer
          url="/audio?id=bbcminute.mp3"
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
