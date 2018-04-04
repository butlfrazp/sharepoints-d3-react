import React, {Component} from 'react';
import {addScript} from './../d3/misc';
import parsets from './../d3/d3.parsets';
import {createGraph, addLink} from './../d3/parallelSet.js'
import * as d3 from 'd3';


class ParallelSet extends Component {
  componentDidMount() {
    var chart = parsets();
    // addScript('http://www.jasondavies.com/parallel-sets/d3.parsets.js');
    // addScript('http://www.jasondavies.com/parallel-sets/highlight.min.js');
    // addScript('http://mbostock.github.com/d3/d3.js?2.5.0');
    createGraph();
  }


  render() {

    return (
      <svg id="psets" viewBox="0 0 960 600" width="1200px"></svg>
    )
  }
}

export default ParallelSet;
