import React, { Component } from "react";

export default class Filter extends Component {
  render() {
    const { defaultStyle, onTextChange } = this.props;
    const filterInputStyle = {
      ...defaultStyle,
      color: "black",
      padding: "10px",
      fontSize: "20px",
    };
    return (
      <div style={defaultStyle}>
        <span>Filter: </span>
        <input
          type="text"
          style={filterInputStyle}
          onKeyUp={(e) => onTextChange(e.target.value)}
        />
      </div>
    );
  }
}
