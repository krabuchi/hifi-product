import React from "react";

export default function PlaylistCounter({ playlists }) {
  return (
    <div className="aggregate">
      <h2>{playlists.length} Playlists </h2>
    </div>
  );
}
