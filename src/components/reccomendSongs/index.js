import React, { useState, useEffect } from "react";
import "./recommendSongs.css";

import Modal from "../modal";

export default function RecommendSongs({ accessToken }) {
  const defGenre = "alt-rock";
  const [tracks, setTracks] = useState([]);
  const [genre, setGenre] = useState([]);
  const [rec, setRec] = useState([]);
  const [show, setShow] = useState(false);
  const [albumData, setAlbumData] = useState({});

  //Get list of recommended albums
  useEffect(() => {
    const getData = async () => {
      const data = await getRecSongs(defGenre);
      setRec(data);
    };
    getData();
  }, []);

  //Get list of all genres
  useEffect(() => {
    const getGenre = async () => {
      const data = await fetch(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
      const results = await data.json();
      setGenre(results.genres);
    };
    getGenre();
  }, []);

  //Fetch 15 albums from user recommendations
  const getRecSongs = async (genre) => {
    let song = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=15&market=IN&seed_genres=${genre}&min_energy=0.6&min_popularity=50`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    let recommend = await song.json();
    let ar = recommend.tracks.map((track) => ({
      name: track.album.name,
      id: track.album.id,
      image: track.album.images[1].url,
      href: track.album.href,
    }));
    return ar;
  };

  //Display List of songs in album
  const displaySong = async (href, img, name) => {
    let song = await fetch(href, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    let songObj = await song.json();
    setTracks(songObj.tracks.items);
    setAlbumData({ img: img, name: name });
    setShow(true);
  };

  const handleChange = async (e) => {
    let selectedGenre = e.target.value;
    const newSongs = await getRecSongs(selectedGenre);
    setRec(newSongs);
  };

  const hideModal = () => setShow(false);

  return (
    <div className="rec-page">
      <h1 className="title">Recommended Albums</h1>
      <select onChange={handleChange} className="genre-options">
        <option>alt-rock</option>
        {genre && genre.map((g, i) => <option key={i}>{g}</option>)}
      </select>

      <ul className="ulStyle">
        {!rec ? (
          <h1>Loading...</h1>
        ) : (
          rec.map((r, i) => (
            <li
              onClick={() => displaySong(r.href, r.image, r.name)}
              key={i}
              className="liStyle"
            >
              <img
                className="imgStyle"
                src={r.image}
                alt={r.name + "-poster"}
              />
              <h2 className="name">{r.name}</h2>
            </li>
          ))
        )}
      </ul>

      <Modal
        show={show}
        hideModal={hideModal}
        albumData={albumData}
        tracks={tracks}
      />
    </div>
  );
}
