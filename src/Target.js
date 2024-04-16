import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class Target extends Component {
  constructor(props) {
    super(props);
    this.state = {target: ""}
  }

  handleTarget = (event) => {
    this.setState({target: event.target.value})
    this.props.selectedValue(event.target.value)
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    let data = this.props.data1;

    let first_row = data[0];

    let numeric_columns = Object.keys(first_row).filter(function (column) {
      return !isNaN(first_row[column]);
    });

    numeric_columns.unshift("")

    d3.select("#target")
      .selectAll("option")
      .data(numeric_columns)
      .join("option")
      .text(function (d) {
        return d;
      });

    d3.select("#target").attr('value', "")

  }

  render() {
    return (
      <div class="target dropdown">
        <label for="target">Select Target: </label>
        <select class="form-select form-select-sm" id="target" style={{width: 'auto', display: 'inline-block', marginLeft: '3px'}} onChange={this.handleTarget}></select>
      </div>
    );
  }
}

export default Target;
