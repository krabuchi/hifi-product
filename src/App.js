import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: `#fff`
};

let fakeServerData = {
  user: {
    name: 'Krab',
    playlists: [
      {
        name: 'My Favorites', 
        songs: [
          {
            name: 'Beat it',  
            duration: 1352
          }, 
            {name: 'In the End', duration: 1662}, 
            {name: 'Wish you were here', duration: 3652}
        ]
      },
      {
        name: 'Discover Weekly', 
        songs: [
          {name: 'Beat it', duration:1359 }, 
          {name: 'In the End', duration: 1565}, 
          {name: 'Wish you were here', duration: 1234}
        ]
      },
      {
        name: 'Our Best Offerings', 
        songs: [
          {name: 'Beat it', duration: 4553}, 
          {name: 'In the End', duration:6212 }, 
          {name: 'Wish you were here', duration:1231 }]
      },
      {
        name: 'Best of 2019', 
        songs: [
          {name: 'Beat it', duration:4534 }, 
          {name: 'In the End', duration:1344 }, 
          {name: 'Wish you were here', duration:8461 }
        ]
      }
    ]
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text" />
        <span>Filter</span>
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
        <h2 style={{color: '#fff'}}>{Math.round((totalDuration/60)/60)} hours</h2>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '20%', display: `inline-block`}}>
        <img />
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li> 
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData:{}
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <>
            <h1 style={defaultStyle}>
              {this.state.serverData.user.name}'s Playlist
            </h1>
            
            <PlaylistCounter playlists={this.state.serverData.user.playlists}/>        
            <HourCounter playlists={this.state.serverData.user.playlists}/>
            
            <Filter />
            <Playlist />
            <Playlist />
            <Playlist />
          </> : <h1 style={defaultStyle}>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
