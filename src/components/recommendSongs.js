import React from "react";

const ulStyle = {
  width: "calc(100% - 2em)",
  margin: "1em",
  display: "grid",
  gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
  gridGap: "1em",
};

const liStyle = {
  display: "flex",
  flexDirection: "column",
  boxShadow: "1px 2px 4px rgba(0, 153, 51, 0.5)",
  color: "#fff",
  borderRadius: "5px",
  border: "2px solid #00e64d",
  overflow: "hidden",
};

const imgStyle = {
  maxWidth: "100%",
};

const title = {
  fontSize: "2.5em",
  color: "#fff",
};

const name = {
  fontSize: "1.2em",
  margin: "1em",
};

export default function RecommendSongs({ recom }) {
  return (
    <div
      style={{ marginTop: "2em", borderTop: "1px solid #ccc", padding: "1em" }}
    >
      <h1 style={title}>Recommended Albums</h1>
      <ul style={ulStyle}>
        {recom &&
          recom.map((r, i) => (
            <li key={i} style={liStyle}>
              <img style={imgStyle} src={r.image} alt={r.name + "-poster"} />
              <h2 style={name}>{r.name}</h2>
            </li>
          ))}
      </ul>
    </div>
  );
}
