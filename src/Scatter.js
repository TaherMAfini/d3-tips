import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class Scatter extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div class="scatter">
        <svg id="scatter" width="500" height="300">
          <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle">Scatterplot: {this.props.target}, col1: {this.props.scatter_columns[0]}, col2: {this.props.scatter_columns[1]}</text>
        </svg>
      </div>
    );
  }
}

export default Scatter;
