import React from "react";

export default function PlaylistCounter({ counterStyle, playlists }) {
  let PlaylistCounterStyle = {
    ...counterStyle,
  };
  return (
    <div className="aggregate" style={PlaylistCounterStyle}>
      <h2 style={{ color: "#fff" }}>{playlists.length} Playlists </h2>
    </div>
  );
}
