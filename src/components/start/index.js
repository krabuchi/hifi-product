import React, { Component } from "react";
import queryString from "querystring";

import "./style.css";

import Playlist from "../playlist/playlist";
import Filter from "../playlist/filter";
import HourCounter from "../playlist/hourCounter";
import PlaylistCounter from "../playlist/playlistCounter";

import RecommendSongs from "../reccomendSongs";
import Personal from "../personal";
import Mood from "../mood";

class Start extends Component {
  constructor(props) {
    super(props);
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
        Accept: "application/json",
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

    const { user, accessToken } = this.state;

    return (
      <div className="App">
        {this.state.user ? (
          <>
            <h1 className="user-name-head">Welcome {user.name}</h1>
            <Mood accessToken={accessToken} />
            <Personal name={user.name} accessToken={accessToken} />
            <PlaylistCounter playlists={playlistToRender} />
            <HourCounter playlists={playlistToRender} />
            <Filter
              onTextChange={(text) => this.setState({ filterString: text })}
            />
            <div className="user-playlists">
              {playlistToRender.map((playlist, i) => (
                <Playlist key={i} playlist={playlist} index={i} />
              ))}
            </div>
            <RecommendSongs accessToken={accessToken} />
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

export default Start;
