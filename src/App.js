import React, { Component } from "react";
import queryString from "querystring";
import "reset-css/reset.css";
import "./App.css";

import Playlist from "./components/playlist";
import Filter from "./components/filter";
import RecommendSongs from "./components/recommendSongs";
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
    };
  }

  async componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed["?access_token"];
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

    let rec = await fetch(
      "https://api.spotify.com/v1/recommendations?market=IN&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_tracks=0c6xIDDpzE81m2q797ordA&min_energy=0.6&min_popularity=50",
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    let recommend = await rec.json();
    let ar = recommend.tracks.map((track) => ({
      name: track.album.name,
      id: track.album.id,
      image: track.album.images[1].url,
    }));
    console.log(recommend.tracks);
    this.setState({
      reccomend: ar,
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
              songs: item.trackDatas.slice(0, 3),
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

    let recom = this.state.reccomend;
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
            <RecommendSongs recom={recom} />
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
