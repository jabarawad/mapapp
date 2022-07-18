import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator } from "d3";
import * as d3 from 'd3'
import useResizeObserver from "./useResizeObserver";

function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
 
  let zoom = d3.zoom()
    .on('zoom', handleZoom);

  function handleZoom(e) {
    d3.select(svgRef.current)
      .attr('transform', e.transform)
  }

  function initZoom() {
    d3.select(svgRef.current)
      .call(zoom);
  }
  

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current)
   
    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    initZoom()
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();
    
    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);
    
    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (event, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", 'lightgrey')
      .attr("d", feature => pathGenerator(feature));
    ;
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;