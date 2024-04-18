import React, { Component } from "react";
import "./App.css";
import Target from "./Target";
import CorrMat from "./CorrMat";
import BarChart from "./BarChart";
import Scatter from "./Scatter";
import * as d3 from "d3";
import tips from "./tips.csv";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {data: [], target: "", numeric_columns: [], scatter_columns: []}
  }

  componentDidMount() {
    let self = this
    d3.csv(tips, function(d) {
      return {
        total_bill: parseFloat(d.total_bill),
        tip: parseFloat(d.tip),
        sex: d.sex,
        smoker: d.smoker,
        day: d.day,
        time: d.time,
        size: parseFloat(d.size)
      }
    }).then(function (csv_data) {
      self.setState({data: csv_data})
      let first_row = csv_data[0];

      let numeric_columns = Object.keys(first_row).filter(function (column) {
        return !isNaN(first_row[column]);
      });
      self.setState({target: numeric_columns[0]})
      self.setState({numeric_columns: numeric_columns})
    })
    .catch(err => console.log(err))
  }

  handleTarget = (target) => {
    this.setState({target: target})
  }

  handleScatterColumns = (columns) => {
    this.setState({scatter_columns: columns})
  }

  render() {
    return (
      <div className="container-fluid text-center">
        <div className="row">
          <Target data1={this.state.data} numeric_columns={this.state.numeric_columns} selectedValue={this.handleTarget}></Target>
        </div>
        <div className="row">
          <div className="col col">
            <BarChart data1={this.state.data} target={this.state.target}></BarChart>
          </div>
          <div className="col">
            <CorrMat data1={this.state.data} target={this.state.target} scatter_columns={this.handleScatterColumns}></CorrMat>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Scatter data1={this.state.data} target={this.state.target} scatter_columns={this.state.scatter_columns}></Scatter>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
