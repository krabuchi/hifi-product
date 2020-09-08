import React from "react";

export default function Modal({ hideModal, show, tracks }) {
  const showHide = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHide}>
      <section className="modal-main">
        <div className="title-bar">
          <h1> Song List</h1>
          <span
            role="img"
            className="cross-mark"
            aria-label="emoji-close"
            onClick={hideModal}
          >
            ❌
          </span>
        </div>
        <ul className="song-list">
          {tracks.map((t, i) => (
            <li className="song-name" key={i}>
              {t.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
