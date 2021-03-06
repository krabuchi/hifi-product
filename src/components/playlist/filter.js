import React, { Component } from "react";

export default class Filter extends Component {
  render() {
    const { onTextChange } = this.props;

    return (
      <div className="filter">
        <span>Filter: </span>
        <input type="text" onKeyUp={(e) => onTextChange(e.target.value)} />
      </div>
    );
  }
}
