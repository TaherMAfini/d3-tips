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

      console.log("Generating Chart, ", selected, target)
      let filteredData = data.map(function (d) {
        return {
          target: d[target],
          selected: d[selected]
        }
      });

      console.log(filteredData)

      let groupedData = d3.rollup(filteredData, v => d3.mean(v, d => d.target), d => d.selected)

      let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

      let x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
      let y = d3.scaleLinear()
        .range([height, 0]);

      let svg = d3.select("#bar-chart")
      if(!svg.empty()) {        
        svg.remove()
      }

      svg = d3.select(".barChart").append("svg")
        .attr("id", "bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
      x.domain(groupedData.keys());
      y.domain([0, d3.max(groupedData.values())]);

      let dataArray = Array.from(groupedData)

      dataArray = dataArray.sort(function(a, b) {
        return a[1] - b[1];
      })

      svg.selectAll(".bar")
        .data(dataArray)
        .join("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return x(d[0]);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
          return y(d[1]);
        })
        .attr("height", function (d) {
          return height - y(d[1]);
        })
        .attr("fill", "steelblue");

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      
      svg.append("g")
        .call(d3.axisLeft(y));

    }
  }

  render() {
    return (
      <div class="barChart">
        <div class="bar-radio my-2"></div>
      </div>
    );
  }
}

export default BarChart;
