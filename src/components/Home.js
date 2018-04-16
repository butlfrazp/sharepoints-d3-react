import React, {Component} from 'react';
import {addScript} from './../d3/misc';
import ParSet from './../d3/parallelSet'
import {SelectionHeader} from './common';
import * as d3 from 'd3';
import Timeknots from './../d3/timeknots'
import tsData from './../d3/datasets/datasetmockup.json';
import data from './../d3/datasets/PSets_MajorSwitching_Aggregate-2.json';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'

const HEADER_BUTTONS = ['Parallel Set', 'Timeline'];

class ParallelSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parsetData: data,
      tsData: tsData,
      filter: "Parallel Set",
      file: "",
      totalType: ""
    }
  }

  componentDidMount() {
    this.configTimeline();
  }

  componentDidUpdate() {
    const {
      filter
    } = this.state;
    if (filter == "Timeline") {
      this.configTimeline();
    }
  }

  renderButtons() {
    var retArr = [];
    HEADER_BUTTONS.map(e => {
      retArr.push(<FlatButton label={e} onClick={() => this.setState({filter: e})} />);
    });
    return retArr;
  }

  checkPassed(day, month, year) {
    if ((month == 5 && day > 3 && year == 2012) || (month > 5 && year == 2012) || year > 2012) {
      return false;
    }
    return true;
  }

  configTimeline() {
    var data = this.state.tsData,
    idArr = [];
    const checkPassed = this.checkPassed;
    data.map(function(e, i) {
      if(!idArr.includes(e['id'])) {
        idArr.push(e['id']);
      }
      const date = new Date(e.timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).length < 2 ? '0' + (date.getMonth() + 1) : String(date.getMonth() + 1);
      const day = String(date.getDate()).length < 2 ? '0' + date.getDate() : String(date.getDate());
      const fullDate = year + '-' + month + '-' + day;
      e.timestamp = fullDate;
      e.date = fullDate;
      const token = checkPassed(day, month, year);
      if (token) {
        if (e.event == 'Start') {
          e.color = 'blue'
          e.image = './blue-start.png';
          e.class = 'smooth'
        }else if (e.event == 'Acad Plan') {
          e.color = 'orange';
          e.image = './orange-warning.png';
          e.class = 'warning'
        }else if (e.event == 'Completion') {
          e.color = 'green';
          e.image = './green-check.png';
          e.class = 'success';
        }
      }else{
        e.color = 'red';
        e.image = './red-warning.png';
        e.class = 'danger';
      }
    });
    const ids = ["104"];
    var maxDate = this.getMaxDate(ids);
    const createTimeline = this.createTimeline;
    ids.map(function(e, i) {
      if (i > 0)  {
        createTimeline(e, maxDate, false, data);
      }else{
        createTimeline(e, maxDate, true, data);
      }
    })
  }

  getMaxDate(ids) {
    var maxDate = 0;
    var data = this.state.tsData;
    data.map(function(e, i) {
      if (ids[0] == e.id) {
        if(maxDate == 0) {
          maxDate = e.date;
        }else if (Date.parse(maxDate) < Date.parse(e.date)) {
          maxDate = e.date;
        }
      }
    });
    return maxDate;
  }

  createTimeline(id, maxDate, showLabels, data) {
    data = data.filter(function(e) {
      if (e.id == id) {
        return e
      }
    });
    const start = {
      id: id,
      event: 'Start',
      timestamp: '2008-08-13',
      date: '2008-08-13',
      color: '#ADD8E6',
      image: './blue-start.png',
      class: 'smooth'
    };
    const EXPECTED_GRAD = {
      id: id,
      event: 'Expected Graduation',
      timestamp: '2012-05-03',
      date: '2012-05-03',
      color: '#ADD8E6',
      class: 'smooth'
    };
    data.unshift(start);
    Timeknots.draw("#timeline", data, {horizontalLayout: false, dateFormat: "%B %Y", labelFormat: "%Y", radius: 20, globalMax: maxDate, globalMin: '2008-08-13', showLabels: showLabels, displacement: showLabels ? 0.2 : 0, width: showLabels ? 850 : 720, expectedGrad: EXPECTED_GRAD});
  }

  handleChange(file) {
    var reader = new FileReader();
    var csvJSON = this.csvJSON;
    var self = this;
    reader.onload = function(event) {
      var result = event.target.result;
      var csv = csvJSON(result);
      self.setState({parsetData: csv, filter: "Parallel Set"});
    }
    reader.readAsText(file[0]);
  }

  csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
    headers = headers.map(e => {
      return e.trim();
    })
    for(var i=1;i<lines.length - 1;i++){
  	  var obj = {};
  	  var currentline=lines[i].split(",");
  	  for(var j=0;j<headers.length;j++){
        if (parseInt(currentline[j]) == currentline[j]) {
          obj[headers[j]] = parseInt(currentline[j]);
        }else{
          obj[headers[j]] = currentline[j];
        }
  	  }
  	  result.push(obj);
    }
    return result;
  }


  renderParset(data) {
    const {
      totalType,
      parsetData
    } = this.state;
    if (totalType != null) {
      return <ParSet data={data}  />
    }
  }

  onChangeText(e) {
    this.setState({totalType: e.target.value});
  }


  renderComponents(data) {
    const {
      filter
    } = this.state;
    switch (filter) {
      case 'Parallel Set':
        return (
          <div>
            <RaisedButton
               containerElement='label' // <-- Just add me!
               label='My Label'>
               <input type="text" value={this.state.totalType} onChange={e => this.onChangeText(e)}/>
               <input type="file" value={this.state.file} onChange={e => this.handleChange(e.target.files)}/>
            </RaisedButton>
            <RaisedButton onClick={() => this.renderComponents()}>
              Submit
            </RaisedButton>
            {this.renderParset(data)}
          </div>
        );
      case 'Timeline':
        return <div id="timeline"></div>;
      default:
        return <div id="timeline"></div>;
    }
  }

  render() {
    return (
      <div style={{flex: 1, alignItems: 'center'}}>
        <SelectionHeader renderButtons={this.renderButtons()} />
        {this.renderComponents(this.state.parsetData)}
      </div>
    )
  }
}

export default ParallelSet;
