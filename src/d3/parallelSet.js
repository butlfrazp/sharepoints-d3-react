import * as d3 from 'd3';
import parsets from './d3.parsets';
import React, {Component} from 'react';
import ReactFauxDOM from 'react-faux-dom';

export default class d3Parset extends Component {

  drawChart() {
    const {
      data,
      headers,
      totalType
    } = this.props;
    var filterKeys = Object.keys(headers);
    filterKeys = filterKeys.filter(e => {
      if (headers[e] == false) {
        return e;
      }
    });
    const type = totalType.trim();
    const element = new ReactFauxDOM.Element('div');
    element.setAttribute("ref", "chart");

    var chart = d3.parsets();
    var width = parseInt(d3.select(element).style("width")),
    height = parseInt(d3.select(element).style("height"));
    var self = this;
    var viz = d3.select(element)
      .append('svg')
      .attr("width", 1000)
      .attr("height", 700);
      var keys = Object.keys(this.props.data[0]);
      keys = keys.filter(e => {
        if (e != "FTFTF Cohort") {
          return e;
        }
      })
      if (filterKeys.length > 0) {
        chart.dimensions(filterKeys);
      }else{
        chart.dimensions(keys);
      }
      var self = this;
      if (type != "None") {
        chart.value(function(d) {
          if (type != "") {
            return d[type]
          }else if (d.Total != null) {
            return d.Total;
          }
          return;
        });
      }
      viz.datum(this.props.data).call(chart);

    return element.toReact();
  }

  render() {
    return (
      this.drawChart()
    )
  }
}
