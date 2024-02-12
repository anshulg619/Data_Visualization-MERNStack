import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';

const PieChart = ({serverData}) => {
    let uniquePestle = [];

    serverData.forEach((i) => {
        if (!uniquePestle.includes(i.pestle) && i.pestle !== "") {
            uniquePestle.push(i.pestle);
        }
    })

    const pestleCount = uniquePestle.map((item) => {
        return {
            pestle: item,
            count: serverData.filter((i) => i.pestle === item).length
        }
    })

    const svgRef = useRef();
    

useEffect(() =>{
// Specify the chart’s dimensions.
const width = 928;
const height = Math.min(width, 500);

// Create the color scale.
const color = d3.scaleOrdinal()
    .domain(pestleCount.map(d => d.pestle))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), pestleCount.length).reverse())

// Create the pie layout and arc generator.
const pie = d3.pie()
    .sort(null)
    .value(d => d.count);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

const labelRadius = arc.outerRadius()() * 0.8;

// A separate arc generator for labels.
const arcLabel = d3.arc()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);

const arcs = pie(pestleCount);

// Create the SVG container.
const svg = d3.select(svgRef.current)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// Add a sector path for each value.
svg.append("g")
    .attr("stroke", "white")
  .selectAll()
  .data(arcs)
  .join("path")
    .attr("fill", d => color(d.data.pestle))
    .attr("d", arc)
  .append("title")
    .text(d => `${d.data.pestle}: ${d.data.count.toLocaleString("en-US")}`);

// Create a new arc generator to place a label close to the edge.
// The label shows the value if there is enough room.
svg.append("g")
    .attr("text-anchor", "middle")
  .selectAll()
  .data(arcs)
  .join("text")
    .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.pestle))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d => d.data.count.toLocaleString("en-US"))));
});

return(
    <svg ref={svgRef}/>
)

}

export default PieChart