import React, { Component } from 'react';
import queryString from 'querystring';
import './App.css';

let defaultStyle = {
  color: `#fff`
};


class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <span>Filter: </span>
        <input type="text" onKeyUp={(e) => this.props.onTextChange(e.target.value)}/>
      </div>
    );
  }
}

class PlaylistCounter extends Component {
  render(){
    return (
      <div className="aggregate" style={{...defaultStyle, width: '40%', display: `inline-block`}}>
        <h2 style={{color: '#fff'}}>{this.props.playlists.length} Playlistname: </h2>
      </div>
    )
  }
}

class HourCounter extends Component {
  render(){
    let allSongs = this.props.playlists.reduce((songs, playlist) => {
      return songs.concat(playlist.songs)
    }, []);
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration;
    }, 0);

    return (
      <div className="aggregate" style={{...defaultStyle, width: '40%', display: `inline-block`}}>
        <h2 style={{color: '#fff'}}>{Math.round(totalDuration/60)} minutes</h2>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{...defaultStyle, width: '20%', display: `inline-block`}}>
        <img src={playlist.imageUrl} alt={playlist.name} style={{width: '200px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(pl => <li>{pl.name}</li>)} 
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData:{},
      filterString: ''
    };
  }

  async componentDidMount() {
    let parsed =  queryString.parse(window.location.search);
    let accessToken =  parsed['?access_token'];  
    if(!accessToken) return;

    /*Fetching and setting User Data from spotify API*/
    let apiEndpoint = "https://api.spotify.com/v1/me/";    
    let response = await fetch(apiEndpoint, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    let userData = await response.json();
    this.setState({
      user: {
        name: userData.display_name
      }
    });

    /*Fetching playlist data from api*/
    let playlistFetch = fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    })
    let playlistResponse = playlistFetch.then(response => response.json())
    playlistResponse.then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = 
        Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map(item => item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000
            }))
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return {
          name: item.name,
          imageUrl: item.images[0].url, 
          songs: item.trackDatas.slice(0,3)
        }
      })
    }))
  }

  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists 
      ? this.state.playlists.filter(playlist => 
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase()))
      : [];

    return (
      <div className="App">
        {this.state.user 
        ? <>
            <h1 style={defaultStyle}>
              {this.state.user.name}'s Playlist
            </h1>

            <PlaylistCounter playlists={playlistToRender}/>        
            <HourCounter playlists={playlistToRender}/>
            
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {playlistToRender.map(playlist => 
              <Playlist playlist={playlist}/>
            )}            
          </> 
          : 
          <button 
            onClick={() => {
              window.location = window.location.href.includes('localhost') 
              ? "http://localhost:8888/login" 
              : "https://hifiproduct-backend.herokuapp.com/login"
            }}
            style={ButtonStyle}
          >
            Sign in with Spotify
          </button>
        }
      </div>
    );
  }
}

const ButtonStyle = {
  padding: '20px', 
  fontSize: '50px', 
  marginTop: '20px'
}

export default App;
