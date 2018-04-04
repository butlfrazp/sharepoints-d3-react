import * as d3 from 'd3';
var dataset = require('./datasets/convertcsv-2.json');
import parsets from './d3.parsets';

export const createGraph = () => {
  var chart = parsets();
  var width = parseInt(d3.select("#psets").style("width")),
  height = parseInt(d3.select("#psets").style("height"));

  var viz = d3.select("#psets")
    .attr("width", width)
    .attr("height", height);
    var data = dataset;
    var keys = Object.keys(data[0]);
    console.log(keys);
    console.log(keys.splice(0, 1));
    chart.dimensions(keys);
    chart.value(function(d) {
      return d.Total;
    });
    viz.datum(data).call(chart);
}
