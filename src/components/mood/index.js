import React, { useState, useEffect } from "react";
import "./style.css";

export default function Mood({ accessToken }) {
  const [tracks, setTracks] = useState([]);
  const [artistList, setArtistList] = useState([]);

  useEffect(() => {
    const getTracks = async () => {
      const url = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50`;
      const resp = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken },
      });
      const results = await resp.json();
      setTracks(results.items);

      const features = results.items.map((item) => item.id).join(",");
      const audioFeatures = await getAudioFeatures(features);
      setArtistList(audioFeatures["audio_features"]);
    };
    getTracks();
  }, []);

  const getAudioFeatures = async (ids) => {
    const url = `https://api.spotify.com/v1/audio-features?ids=${ids}`;
    const resp = await fetch(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const results = await resp.json();
    return results;
  };

  const getTracks = async (list) => {
    const ids = list.map((el) => el.id).join(",");
    const uri = `https://api.spotify.com/v1/tracks?ids=${ids}`;
    const response = await fetch(uri, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const results = await response.json();
    setTracks(results.tracks);
  };

  const handleMoodChange = (e) => {
    let val = Number(e.target.value) / 10;
    if (val >= 0 && val < 0.25) {
      const sad = artistList.filter(
        (el) => el.valence < 0.25 && el.valence > 0
      );
      getTracks(sad);
    } else if (val >= 0.26 && val < 0.49) {
      const nice = artistList.filter(
        (el) => el.valence < 0.49 && el.valence > 0.26
      );
      getTracks(nice);
    } else if (val >= 0.5 && val < 0.69) {
      const happy = artistList.filter(
        (el) => el.valence < 0.69 && el.valence > 0.5
      );
      getTracks(happy);
    } else if (val >= 0.7 && val < 0.89) {
      const party = artistList.filter(
        (el) => el.valence < 0.89 && el.valence > 0.7
      );
      getTracks(party);
    } else if (val >= 0.9 && val <= 1) {
      const exited = artistList.filter(
        (el) => el.valence < 1 && el.valence > 0.9
      );
      getTracks(exited);
    }
  };

  return (
    <div className="mood-container">
      <h1 className="mood-title">How do You feel</h1>
      <div className="mood-range">
        <span role="img" aria-label="sad-emoji">
          😢
        </span>
        <input
          type="range"
          onChange={handleMoodChange}
          min="0"
          max="10"
          name="mood"
        />
        <span role="img" aria-label="happy-emoji">
          🙂
        </span>
      </div>
      <ul className="mood-track-list">
        {tracks && tracks.map((t) => <li key={t.id}>{t.name}</li>)}
      </ul>
      <small className="small-notification">
        Listen more songs for better experience
      </small>
    </div>
  );
}
