import React, { Component } from "react";
import queryString from "querystring";
import "reset-css/reset.css";
import "./App.css";

import Playlist from "./components/playlist";
import Filter from "./components/filter";
import RecommendSongs from "./components/reccomendSongs";
import HourCounter from "./components/hourCounter";
import PlaylistCounter from "./components/playlistCounter";

let defaultStyle = {
  color: `#fff`,
  fontFamily: "Special Elite, cursive",
  letterSpacing: "1.5px",
};

let counterStyle = {
  ...defaultStyle,
  width: "40%",
  display: `inline-block`,
  marginBottom: "10px",
  fontSize: "20px",
  lineHeight: "30px",
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: "",
      accessToken: "",
    };
  }

  async componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed["?access_token"];
    this.setState({ accessToken });
    if (!accessToken) return;

    /*Fetching and setting User Data from spotify API*/
    let apiEndpoint = "https://api.spotify.com/v1/me/";
    let response = await fetch(apiEndpoint, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    let userData = await response.json();
    this.setState({
      user: {
        name: userData.display_name,
      },
    });
    /*Fetching playlist data from api*/
    let playlistFetch = fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + accessToken },
    });

    let playlistResponse = playlistFetch.then((response) => response.json());

    playlistResponse
      .then((playlistData) => {
        let playlists = playlistData.items;
        let trackDataPromises = playlists.map((playlist) => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { Authorization: "Bearer " + accessToken },
          });
          let trackDataPromise = responsePromise.then((response) =>
            response.json()
          );
          return trackDataPromise;
        });
        let allTracksDataPromises = Promise.all(trackDataPromises);
        let playlistsPromise = allTracksDataPromises.then((trackDatas) => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map((item) => item.track)
              .map((trackData) => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000,
              }));
          });
          return playlists;
        });
        return playlistsPromise;
      })
      .then((playlists) =>
        this.setState({
          playlists: playlists.map((item) => {
            return {
              name: item.name,
              imageUrl: item.images[0].url,
              songs: item.trackDatas,
            };
          }),
        })
      );
  }

  render() {
    let playlistToRender =
      this.state.user && this.state.playlists
        ? this.state.playlists.filter((playlist) => {
            let matchesPlaylist = playlist.name
              .toLowerCase()
              .includes(this.state.filterString.toLowerCase());
            let matchesSong = playlist.songs.find((song) =>
              song.name
                .toLowerCase()
                .includes(this.state.filterString.toLowerCase())
            );
            return matchesPlaylist || matchesSong;
          })
        : [];

    return (
      <div className="App">
        {this.state.user ? (
          <>
            <h1 style={{ ...defaultStyle, fontSize: "54px", marginTop: "5px" }}>
              {this.state.user.name}'s Playlist
            </h1>

            <PlaylistCounter
              counterStyle={counterStyle}
              playlists={playlistToRender}
            />
            <HourCounter
              counterStyle={counterStyle}
              playlists={playlistToRender}
            />

            <Filter
              defaultStyle={defaultStyle}
              onTextChange={(text) => this.setState({ filterString: text })}
            />

            {playlistToRender.map((playlist, i) => (
              <Playlist
                defaultStyle={defaultStyle}
                key={i}
                playlist={playlist}
                index={i}
              />
            ))}
            <RecommendSongs accessToken={this.state.accessToken} />
          </>
        ) : (
          <button
            onClick={() => {
              window.location = window.location.href.includes("localhost")
                ? "http://localhost:8888/login"
                : "https://hifiproduct-backend.herokuapp.com/login";
            }}
            style={ButtonStyle}
          >
            Sign in with Spotify
          </button>
        )}
      </div>
    );
  }
}

const ButtonStyle = {
  padding: "20px",
  fontSize: "50px",
  marginTop: "20px",
};

export default App;
