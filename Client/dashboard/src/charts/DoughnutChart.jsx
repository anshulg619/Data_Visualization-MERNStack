import React ,{useRef, useEffect}from 'react'
import * as d3 from 'd3';

const DoughnutChart = ({serverData}) => {

    let uniqueSectors = [];
    //using forEach because it doesn't return any array
    serverData.forEach((i) => {
        if (!uniqueSectors.includes(i.sector) && i.sector !== "") {
            uniqueSectors.push(i.sector);
        }
    })

    let uniqueTopics = [];
    serverData.forEach((i) => {
        if (!uniqueTopics.includes(i.topic) && i.topic !== "") {
            uniqueTopics.push(i.topic);
        }
    })

    let uniqueRegion = [];
    serverData.forEach((i) => {
        if (!uniqueRegion.includes(i.region) && i.region !== "") {
            uniqueRegion.push(i.region);
        }
    })

    let uniqueCountry = [];
    serverData.forEach((i) => {
        if (!uniqueCountry.includes(i.country) && i.country !== "") {
            uniqueCountry.push(i.country);
        }
    })

    let uniqueSource = [];
    serverData.forEach((i) => {
        if (!uniqueSource.includes(i.source) && i.source !== "") {
            uniqueSource.push(i.source);
        }
    })

    let uniquePestle = [];
    serverData.forEach((i) => {
        if (!uniquePestle.includes(i.pestle) && i.pestle !== "") {
            uniquePestle.push(i.pestle);
        }
    })

    const label = ["Country", "Region", "Source", "Topic", "Sector", "Pestle"];
    const length = [uniqueCountry.length,uniqueRegion.length,uniqueSource.length,uniqueTopics.length,uniqueSectors.length,uniquePestle.length]

    let count=0;
    const data = label.map((item) => {
        return {
            name: item,
            value:length[count++]
        }
    })

    const svgRef = useRef();

useEffect(() => {
    const width=928;
    const height = Math.min(width, 500);
    const radius = Math.min(width, height) / 2;
  
    const arc = d3.arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);
  
    const pie = d3.pie()
        .padAngle(1 / radius)
        .sort(null)
        .value(d => d.value);
  
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
  
    const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
  
    svg.append("g")
      .selectAll()
      .data(pie(data))
      .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
      .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
  
    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(data))
      .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString("en-US")));
  
}, [data])

return(
    <svg ref={svgRef}/>
)
}

export default DoughnutChart