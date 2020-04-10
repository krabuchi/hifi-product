import React, {Component} from 'react';
import './App.css';

let textColor = `#fff`;
let defaultStyle = {
  color: textColor
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

class Aggregate extends Component {
  render(){
    return (
      <div className="aggregate" style={{...defaultStyle, width: '40%', display: `inline-block`}}>
        <h2 style={{color: '#fff'}}>Number Text</h2>
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

function App() {
  return (
    <div className="App">
      <h1 style={{color: textColor}}>Title</h1>
      <Aggregate />
      <Aggregate />
      <Filter />
      <Playlist />
      <Playlist />
      <Playlist />
    </div>
  );
}

export default App;
