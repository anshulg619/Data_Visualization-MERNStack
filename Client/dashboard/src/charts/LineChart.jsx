import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';

const LineChart = ({serverData}) => {

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

useEffect(() => {
const width = 928;
const height = 500;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3.scaleBand()
.domain(d3.sort(pestleCount, d => -d.count).map(d=>d.pestle))
.range([marginLeft, width - marginRight])
.padding(0.1);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear([0, d3.max(pestleCount, d => d.count)], [height - marginBottom, marginTop]);

// Declare the line generator.
const line = d3.line()
    .x(d => x(d.pestle))
    .y(d => y(d.count));

// Create the SVG container.
const svg = d3.select(svgRef.current)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

// Add the x-axis.
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width/80).tickSizeOuter(0));

// Add the y-axis, remove the domain line, add grid lines and a label.
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Count"));

// Append a path for the line.
svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line(pestleCount));
}, [pestleCount]);

return(
    <svg ref = {svgRef}/>
)
}

export default LineChart