import React, { useState } from "react";
import "./style.css";

import Modal from "../modal";

export default function Playlist({ playlist, defaultStyle, index }) {
  const [show, setShow] = useState(false);
  const albumData = { img: playlist.imageUrl, name: playlist.name };

  const hideModal = () => setShow(false);

  return (
    <>
      <div className="user-playlist-item" onClick={() => setShow(true)}>
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          style={{ width: "200px" }}
        />
        <h2>{playlist.name}</h2>
      </div>
      <Modal
        show={show}
        hideModal={hideModal}
        albumData={albumData}
        tracks={playlist.songs}
      />
    </>
  );
}
