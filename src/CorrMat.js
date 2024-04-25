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

  handleScatterColumns = (rect) => {
    let columns = [rect.getAttribute("col1"), rect.getAttribute("col2")]
    this.props.scatter_columns(columns)
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
    let correlations = []

    for (let i = 0; i < num_colums; i++) {
      for (let j = 0; j < num_colums; j++) {
        grid.push({
          col1: numeric_columns[i],
          col2: numeric_columns[j],
          value: corr_data[i][numeric_columns[j]],
          x: j*80,
          y: i*80
        })
        correlations.push(corr_data[i][numeric_columns[j]])
      }
    }


    
    let container = d3.select("#corr-matrix")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${110}, ${15})`);

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
      .call(d3.axisBottom(x).tickSize(0))
      .style("font-size", "15px")
      .selectAll(".domain").remove()

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
      .call(d3.axisLeft(y).tickSize(0))
      .style("font-size", "15px")
      .selectAll(".domain").remove()


    //Squares
    container.selectAll(".rect_g")
      .data(grid)
      .join(
        enter => {

          let g = enter.append("g")
            .attr("class", "rect_g")

          g.append("rect")
            .attr("x", function (d) {
              return d.x
            })
            .attr("y", function (d) {
              return d.y
            })
            .attr("width", 80)
            .attr("height", 80)
            .attr("value", d => d.value)
            .attr("col1", d => d.col1)
            .attr("col2", d => d.col2)
            .attr("fill", function (d) {
              return d3.interpolatePlasma(d.value)
            })
            .on("click", function (d) {
              let rect = d.srcElement
              self.handleScatterColumns(rect)
            })
          
          g.append("text")
            .attr("x", function (d) {
              return d.x + 40
            })
            .attr("y", function (d) {
              return d.y + 40
            })
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(function (d) {
              return d.value
            })
            .attr('pointer-events', 'none')
        }
      )

      //Colorbar
      
      let defs = container.append("defs")

      let linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")

      linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")

      linearGradient.selectAll("stop")
        .data(d3.range(-1, 1.1, 0.1))
        .join("stop")
        .attr("offset", d => `${d * 100}%`)
        .attr("stop-color", d => d3.interpolatePlasma(d))

      container.append("rect")
        .attr("width", 20)
        .attr("height", 240)
        .style("fill", "url(#linear-gradient)")
        .attr("transform", `rotate(180) translate(-320, -240)`)

      
      let colorbar = d3.scaleLinear()
        .domain([d3.max(correlations), 0])
        .range([0, 240])

      container.append("g")
        .attr("transform", `translate(320, 0)`)
        .call(d3.axisRight(colorbar).ticks(5).tickSize(0))
        .style("font-size", "15px")
        .selectAll(".domain").remove()



  }

  render() {
    return (
      <div class="corrMat">
        <p style={{marginTop: '1rem'}}><strong>Correlation Matrix</strong></p>
        <svg id="corr-matrix">
          <g className="g_2"></g>
        </svg>
      </div>
    );
  }
}

export default CorrMat;
