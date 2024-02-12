import React, {useRef, useEffect} from 'react'
import * as d3 from "d3";


const BarChart = ({serverData}) => {

    let uniqueSectors = [];
    
    //using forEach because it doesn't return any array and we are adding unique sector names to an array
    serverData.forEach((i) => {
        if (!uniqueSectors.includes(i.sector) && i.sector !== "") {
            uniqueSectors.push(i.sector);
        }
    })


    //counting the total number of projects in each sector uniquely
     const sectorCount = uniqueSectors.map((item) => {
         return {
             sector: item,
            count: serverData.filter((i) => i.sector === item).length
         }
     })

     const svgRef=useRef();
    

  useEffect(()=>{

    
    // Specify the chart’s dimensions.
     let width = 1200 ;
     let height =500 ;
     let marginTop = 20 ;
     let marginRight = 0;
     let marginBottom = 30;
     let marginLeft = 40 ;
  
    // Create the horizontal scale and its axis generator.
    const x = d3.scaleBand()
      .domain(d3.sort(sectorCount, d => -d.count ).map(d => d.sector))
      .range([marginLeft, width - marginRight])
      .padding(0.5);
  
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
  
  
    // Create the vertical scale.
    const y = d3.scaleLinear()
      .domain([0, d3.max(sectorCount, d => d.count )]).nice()
      .range([height - marginBottom, marginTop]);
  
    // Create the SVG container and call the zoom behavior.
    const svg = d3.select(svgRef.current)
        .attr("viewBox", [0, 0, width, height])
         .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
        .call(zoom);
  
    // Append the bars.
    svg.append("g")
        .attr("class", "bars")
        .attr("fill", "steelblue")
      .selectAll("rect")
      .data(sectorCount)
      .join("rect")
        .attr("x", d => x(d.sector))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth());
  
    // Append the axes.
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
  
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove());
  
    //return svg.node();
  
    function zoom(svg) {
      const extent = [[marginLeft, marginTop], [width - marginRight, height - marginTop]];
  
      svg.call(d3.zoom()
          .scaleExtent([1, 8])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", zoomed));
  
      function zoomed(event) {
        x.range([marginLeft, width - marginRight].map(d => event.transform.applyX(d)));
        svg.selectAll(".bars rect").attr("x", d => x(d.letter)).attr("width", x.bandwidth());
        svg.selectAll(".x-axis").call(xAxis);
      }
    }
  },[sectorCount]);

  return(
    <svg ref={svgRef}/>
  );
}

export default BarChart;