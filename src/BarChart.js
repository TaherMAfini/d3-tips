import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: ""}
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    let self = this
    let data = this.props.data1

    // Radio Buttons
    let first_row = data[0];

    let cat_columns = Object.keys(first_row).filter(function (column) {
      return isNaN(first_row[column]);
    });

    if(document.querySelector(".bar-radio").innerHTML === "") {
      cat_columns.map((col) => {
        document.querySelector(".bar-radio").innerHTML += `<input type="radio" class="ms-2" name="bar-radio" value="${col}"></input><label class="me-2" for="${col}">${col}</label>`
      })
    }
    
    d3.select(".bar-radio").selectAll("input").on("change", function () {
      self.setState({selected: d3.select(this).property("value")})
    })

    // Bar Chart
    let selected = this.state.selected
    let target = this.props.target

    if (selected !== "" && target !== "") {

      let filteredData = data.map(function (d) {
        return {
          target: d[target],
          selected: d[selected]
        }
      });

      let groupedData = d3.rollup(filteredData, v => d3.mean(v, d => d.target), d => d.selected)

      let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;


      let container = d3.select("#bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select(".g_1")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        //X axis

        let x_data = Array.from(groupedData.keys());
        let x_scale = d3.scaleBand()
          .domain(x_data)
          .range([margin.left, width])
          .padding(0.2);

        container.selectAll(".x-axis-g")
          .data([0])
          .join("g")
          .attr("class", "x-axis-g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x_scale));

        //Y axis
        let y_data = Array.from(groupedData.values());
        let y_scale = d3.scaleLinear()
          .domain([0, d3.max(y_data)])
          .range([height, 0]);

        container.selectAll(".y-axis-g")
          .data([0])
          .join("g")
          .attr("class", "y-axis-g")
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y_scale));
          
        //Bars
        container.selectAll("rect")
          .data(groupedData)
          .join("rect")
          .attr("x", d => x_scale(d[0]))
          .attr("y", d => y_scale(d[1]))
          .attr("width", x_scale.bandwidth())
          .attr("height", d => height - y_scale(d[1]))
          .attr("fill", "steelblue");

        //Y axis label
        container.selectAll(".y-axis-label")
          .data([0])
          .join("text")
          .attr("class", "y-axis-label")
          .attr("transform", `translate(0, ${height / 2}) rotate(-90)`)
          .attr("text-anchor", "middle")
          .text("Mean " + target);

    }
  }

  render() {
    return (
      <div class="barChart">
        <div class="bar-radio my-2"></div>
        <svg id="bar-chart">
          <g className="g_1"></g>
        </svg>
      </div>
    );
  }
}

export default BarChart;
