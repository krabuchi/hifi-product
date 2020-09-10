import React from "react";
import "./style.css";

export default function Modal({ hideModal, show, tracks, albumData }) {
  const showHide = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHide}>
      <section className="modal-main">
        <div className="title-bar">
          <h1>{albumData.name}</h1>
          <span
            role="img"
            className="cross-mark"
            aria-label="emoji-close"
            onClick={hideModal}
          >
            ❌
          </span>
        </div>
        <div className="data">
          <ul className="song-list">
            {tracks.map((t, i) => (
              <li className="song-name" key={i}>
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
