import * as d3 from 'd3';
import parsets from './d3.parsets';
import React, {Component} from 'react';
import ReactFauxDOM from 'react-faux-dom';

export default class d3Parset extends Component {

  drawChart(totalType) {
    const data = this.props.data;
    const element = new ReactFauxDOM.Element('div');

    element.setAttribute("ref", "chart");


    var chart = d3.parsets();
    var width = parseInt(d3.select(element).style("width")),
    height = parseInt(d3.select(element).style("height"));
    var viz = d3.select(element)
      .append('svg')
      .attr("width", 900)
      .attr("height", 900);
      var keys = Object.keys(this.props.data[0]);
      chart.dimensions(keys);
      chart.value(function(d) {
        if (d.Count != null) {
          return d.Count;
        }else if (d.Total != null) {
          return d.Total;
        }
        return d.Total;
      });
      viz.datum(this.props.data).call(chart);

    return element.toReact();
  }

  render() {
    return (
      this.drawChart(this.props.totalType)
    )
  }
}
