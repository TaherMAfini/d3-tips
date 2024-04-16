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
    this.state = {data: [], target: ""}
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
    })
    .catch(err => console.log(err))
  }

  handleTarget = (target) => {
    this.setState({target: target})
  }

  render() {
    return (
      <div className="container-fluid text-center">
        <div className="row">
          <Target data1={this.state.data} selectedValue={this.handleTarget}></Target>
        </div>
        <div className="row">
          <div className="col col">
            <BarChart data1={this.state.data} target={this.state.target}></BarChart>
          </div>
          <div className="col">
            <CorrMat data1={this.state.data} target={this.state.target}></CorrMat>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Scatter data1={this.state.data} target={this.state.target}></Scatter>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
