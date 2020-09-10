import React from "react";

export default function HourCounter({ playlists }) {
  let allSongs = playlists.reduce((songs, playlist) => {
    return songs.concat(playlist.songs);
  }, []);
  let totalDuration = allSongs.reduce((sum, eachSong) => {
    return sum + eachSong.duration;
  }, 0);

  let totalDurationHours = Math.round(totalDuration / 60);
  let isTooLow = totalDurationHours < 44;

  let hourCounterStyle = isTooLow ? "red" : "aggregate";

  return (
    <div className={hourCounterStyle}>
      <h2>{totalDurationHours} minutes</h2>
    </div>
  );
}
