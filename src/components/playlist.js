import React, { useState } from "react";
import Modal from "./modal";

export default function Playlist({ playlist, defaultStyle, index }) {
  const [show, setShow] = useState(false);

  const hideModal = () => setShow(false);

  let PlaylistStyle = {
    ...defaultStyle,
    width: "24%",
    display: `inline-block`,
    lineHeight: "30px",
    padding: "10px",
    backgroundColor: index % 2 ? "#c0c0c0" : "#808080",
    cursor: "pointer",
  };

  return (
    <>
      <div style={PlaylistStyle} onClick={() => setShow(true)}>
        <h3>{playlist.name}</h3>
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          style={{ width: "200px" }}
        />
      </div>
      <Modal show={show} hideModal={hideModal} tracks={playlist.songs} />
    </>
  );
}
