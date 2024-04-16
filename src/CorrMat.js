import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class CorrMat extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div class="corrMat">
        <svg id="corr-matrix">
          <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle">Correlation Matrix: {this.props.target}</text>
        </svg>
      </div>
    );
  }
}

export default CorrMat;
