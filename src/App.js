import React from "react";
// import Video from "./Video";
import GeoChart from "./components/geoChart";
import data from "./geoData.json";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <h2>World Map with d3-geo</h2>
      <GeoChart data={data} property={"mapcolor7"} />
    </React.Fragment>
  );
}

export default App;