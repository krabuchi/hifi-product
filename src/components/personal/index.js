import React, { useState, useEffect } from "react";
import "./style.css";

export default function Personal({ name, accessToken }) {
  const [timeRange, setTimeRange] = useState("short_term");
  const [tracks, setTracks] = useState([]);
  const [type, setType] = useState("tracks");

  useEffect(() => {
    const getPersonalFav = async () => {
      try {
        const resp = await fetch(
          `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=10`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        const results = await resp.json();
        setTracks(results.items);
      } catch (e) {
        console.log(e);
      }
    };
    getPersonalFav();
  }, [timeRange, accessToken, type]);

  const handleType = (e) => {
    const ty = e.target.value;
    switch (ty) {
      case "artists":
        setType("artists");
        break;
      case "tracks":
        setType("tracks");
        break;
      default:
        setType("tracks");
        break;
    }
  };

  const handleClick = (e) => {
    const tRange = e.target.value;
    switch (tRange) {
      case "medium_term":
        setTimeRange("medium_term");
        break;
      case "long_term":
        setTimeRange("long_term");
        break;
      default:
        setTimeRange("short_term");
    }
  };

  return (
    <div className="users-top-page">
      <h1 className="name-type">
        {name} top {type} 🎼{" "}
      </h1>
      <div className="type-button-container">
        <button onClick={handleType} value="tracks">
          Tracks
        </button>
        <button onClick={handleType} value="artists">
          Artists
        </button>
      </div>
      <div className="range-button-container">
        <button onClick={handleClick} value="short_term">
          Last Month
        </button>
        <button onClick={handleClick} value="medium_term">
          Last 6 Month
        </button>
        <button onClick={handleClick} value="long_term">
          All Time
        </button>
      </div>
      <ul className="list-artist-track">
        {tracks.map((t, i) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
