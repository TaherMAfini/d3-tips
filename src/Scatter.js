import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class Scatter extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidUpdate() {
    let data = this.props.data1

    let col1 = this.props.scatter_columns[0]
    let col2 = this.props.scatter_columns[1]

    console.log("X: ", col1, ", Y: ", col2)

    if(col1 !== undefined && col2 !== undefined) {
      let filteredData = data.map(function (d) {
        return {
          col1: d[col1],
          col2: d[col2]
        }
      });

      let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

      let container = d3.select("#scatter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select(".g_3")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // X-Axis
      let x_data = filteredData.map(d => d.col1);
      const x_scale = d3.scaleLinear()
        .domain([0, d3.max(x_data)])
        .range([margin.left, width]);

      container.selectAll(".x-axis-g")
        .data([0])
        .join("g")
        .attr("class", "x-axis-g")
        .attr("transform", `translate(0, ${height-20})`)
        .call(d3.axisBottom(x_scale));

      // X-Axis Label
      container.selectAll(".x-axis-label")
        .data([0])
        .join("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.top)
        .attr("text-anchor", "middle")
        .text(col1);

      // Y-Axis
      let y_data = filteredData.map(d => d.col2);
      const y_scale = d3.scaleLinear()
        .domain([0, d3.max(y_data)])
        .range([height-20, 0]);

      container.selectAll(".y-axis-g")
        .data([0])
        .join("g")
        .attr("class", "y-axis-g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y_scale));

      // Y-Axis Label
      container.selectAll(".y-axis-label")
        .data([0])
        .join("text")
        .attr("class", "y-axis-label")
        .attr("transform", `translate(0, ${height / 2}) rotate(-90)`)
        .attr("text-anchor", "middle")
        .text(col2);

      // Circles
      container.selectAll("circle")
        .data(filteredData)
        .join("circle")
        .attr("cx", d => x_scale(d.col1))
        .attr("cy", d => y_scale(d.col2))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("opacity", 0.5)

    }
  }

  render() {
    return (
      <div class="scatter">
        <svg id="scatter" width="800" height="300">
          <g className="g_3"></g>
        </svg>
      </div>
    );
  }
}

export default Scatter;
