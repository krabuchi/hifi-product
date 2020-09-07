import React from "react";

export default function Playlist({ playlist, defaultStyle, index }) {
  let PlaylistStyle = {
    ...defaultStyle,
    width: "24%",
    display: `inline-block`,
    lineHeight: "30px",
    padding: "10px",
    backgroundColor: index % 2 ? "#c0c0c0" : "#808080",
  };

  return (
    <div style={PlaylistStyle}>
      <h3>{playlist.name}</h3>
      <img
        src={playlist.imageUrl}
        alt={playlist.name}
        style={{ width: "200px" }}
      />
    </div>
  );
}
