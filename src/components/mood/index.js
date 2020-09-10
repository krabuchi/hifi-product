import React, { useState, useEffect } from "react";

export default function Mood({ accessToken }) {
  const [tracks, setTracks] = useState([]);
  const [artistList, setArtistList] = useState([]);

  useEffect(() => {
    const getTracks = async () => {
      const url = `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=100`;
      const resp = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken },
      });
      const results = await resp.json();
      setTracks(results.items);

      const features = results.items.map((item) => item.id).join(",");
      const audioFeatures = await getAudioFeatures(features);
      setArtistList(audioFeatures);
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

  const handleMoodChange = (e) => {
    let val = Number(e.target.value) / 10;
    const tr = artistList.filter((el) => {
      if (
        val < 0.1 &&
        el.valence <= val + 0.15 &&
        el.danceability <= (val * 8) / 10 &&
        el.energy <= val
      ) {
        return el.id;
      } else if (
        val <= 0.2 &&
        el.valence <= val + 0.75 &&
        el.danceability <= (val * 4) / 10 &&
        el.energy <= (val * 5) / 10
      ) {
        return el.id;
      } else if (
        val <= 0.5 &&
        el.valence <= val + 0.05 &&
        el.danceability <= (val * 1.75) / 10 &&
        el.energy <= (val * 1.75) / 10
      ) {
        return el.id;
      } else if (
        val <= 0.7 &&
        el.valence <= val + 0.075 &&
        el.danceability <= val / 2.5 / 10 &&
        el.energy <= val / 2 / 10
      ) {
        return el.id;
      } else if (
        val <= 0.9 &&
        el.valence <= val + 0.075 &&
        el.danceability <= val / 2 / 10 &&
        el.energy <= val / 1.5 / 10
      ) {
        return el.id;
      } else if (
        val <= 0.9 &&
        el.valence <= val + 1 &&
        el.danceability <= val / 1.75 / 10 &&
        el.energy <= val / 1.5 / 10
      ) {
        return el.id;
      }
    });
    console.log(tr);
  };

  return (
    <div>
      <h1>Mood</h1>
      <div>
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
      <ul>
        {tracks.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
