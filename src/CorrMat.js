import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

function correlation(x, y) {
  let n = x.length;

  let sum_x = d3.sum(x);
  let sum_y = d3.sum(y);
  let sum_xy = d3.sum(x.map(function (d, i) {
    return d * y[i]
  }));
  let square_sum_x = d3.sum(x.map(function (d) {
    return d * d
  }))
  let square_sum_y = d3.sum(y.map(function (d) {
    return d * d
  }))

  let numerator = n*sum_xy - sum_x*sum_y;
  let denominator = Math.sqrt((n*square_sum_x - sum_x*sum_x) * (n*square_sum_y - sum_y*sum_y));

  return Math.round(numerator / denominator * 100) / 100
}

class CorrMat extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  

  componentDidUpdate() {
    let self = this
    let data = this.props.data1

    let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    let first_row = data[0];

    let numeric_columns = Object.keys(first_row).filter(function (column) {
      return !isNaN(first_row[column]);
    });

    let num_colums = numeric_columns.length

    let corr_data = []

    numeric_columns.forEach(function (column1) {
      let row = {}
      numeric_columns.forEach(function (column2) {
        let col1 = data.map(function (d) {
          return d[column1]
        })
        let col2 = data.map(function (d) {
          return d[column2]
        })
        row[column2] = correlation(col1, col2)
      })
      corr_data.push(row)
    })

    let grid = []

    for (let i = 0; i < num_colums; i++) {
      for (let j = 0; j < num_colums; j++) {
        grid.push({
          col1: numeric_columns[i],
          col2: numeric_columns[j],
          value: corr_data[i][numeric_columns[j]],
          x: j*80,
          y: i*80
        })
      }
    }

    console.log(grid)
    
    let container = d3.select("#corr-matrix")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${130}, ${30})`);

    //X axis
    let x_data = numeric_columns;
    let x = d3.scaleBand()
      .domain(x_data)
      .range([0, 240]);
      
    container.selectAll(".x-axis-g")
      .data([0])
      .join("g")
      .attr("class", "x-axis-g")
      .attr("transform", `translate(0, ${240})`)
      .call(d3.axisBottom(x).tickSize(0));

    //Y axis
    let y_data = numeric_columns;
    let y = d3.scaleBand()
      .domain(y_data)
      .range([0, 240]);

    container.selectAll(".y-axis-g")
      .data([0])
      .join("g")
      .attr("class", "y-axis-g")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(y).tickSize(0));

    container.selectAll("rect")
      .data(grid)
      .join("rect")
      .attr("x", function (d) {
        return d.x
      })
      .attr("y", function (d) {
        return d.y
      })
      .attr("width", 80)
      .attr("height", 80)
      .attr("fill", function (d) {
        return d3.interpolateBuGn(d.value)
      })
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .text(function (d) {
        return d.value
      })

  }

  render() {
    return (
      <div class="corrMat">
        <p><strong>Correlation Matrix</strong></p>
        <svg id="corr-matrix">
          <g className="g_2"></g>
        </svg>
      </div>
    );
  }
}

export default CorrMat;
