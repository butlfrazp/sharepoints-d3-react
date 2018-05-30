/*
  Note:
  This version of react did not have babel, so all of the common components
  methods are within this file
*/

import React, {Component} from 'react';
import {addScript} from './../d3/misc';
import ParSet from './../d3/parallelSet'
import {
  SelectionHeader,
  Modal,
  Data,
  Parameters
} from './common';
import * as d3 from 'd3';
import data from './../d3/datasets/PSets_MajorSwitching_Aggregate-2.json';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import $ from 'jquery';

var fileDownload = require('js-file-download');

const HEADER_BUTTONS = ['Parallel Set'];

class ParallelSet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rawParams: [],
      parsetData: data,
      rawData: null,
      file: "",
      dataPath: "",
      dataType: "json",
      totalType: "None",
      disabled: true,
      headers: [],
      open: false,
      queuedData: {
        data: null,
        headers: [],
        totalType: null
      },
      headerCheckBoxes: {},
      parameterInput: "",
      url: false,
      error: "",
    }
  }

  componentDidMount() {
    this.setState({parameterInput: JSON.stringify(this.state.headers)})
  }

  onDataPathChange(self, val) {
    self.setState({dataPath: val});
  }

  //tests the url and if the url has valid csv or json data then the configCSV function will be called
  onDataPathBtnPressed(self) {
    var digest = $('#__REQUESTDIGEST').val();
    const URL = self.state.dataPath;
    $.ajax({
      url: URL,
      method: "GET",
      headers: {
        accept: "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      success: function(e) {
        if (URL.includes(".csv")) {
          self.setState({url: true, dataType: "csv", error: ""});
          self.configCSVData(self, e);
        }else if (URL.includes(".json")){
          self.setState({url: true, dataType: "json", error: ""});
          self.configJSON(self, e);
        }
      },
      error: function(e) {
        self.setState({error: "Sorry, the path that you entered was either invalid or we could not acces the data"});
      }
    })
  }

  //handles the change when a new file is added
  handleChange(file, self) {
    self.setState({url: false});
    var reader = new FileReader();
    var fileMetaData = file[0];
    reader.onload = function(event) {
      self.setState({ rawData: event.target.result, disabled: false });
      if (fileMetaData.name.includes(".csv")) {
        self.setState({url: false, dataType: "csv"})
        self.configCSVData(self, event.target.result);
      }else if(fileMetaData.name.includes(".json") || fileMetaData.name.includes(".txt")){
        self.configJSON(self, fileMetaData);
      }
    }
    reader.readAsText(fileMetaData);
  }

  //turns csv to json and sets data and headers
  configCSVData(self, file) {
    var parsetHeader = null;
    var parsetData = null;
    var parsetTotaltype = null;

    var csv = file;
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
    if (headers.length != 0) {
      parsetHeader = headers;
      self.setState({disabled: false});
    }
    var headerObj = {};
    headers = headers.map(e => {
      headerObj[e] = false;
      return e.trim();
    })
    self.setState({headerCheckBoxes: headerObj, headers: Object.keys(headerObj), rawParams: Object.keys(headerObj), parameterInput: JSON.stringify(Object.keys(headerObj))})
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
    parsetData = result;
    const val = {
      data: parsetData,
      headers: parsetHeader,
      totalType: parsetTotaltype
    }
    self.setState({queuedData: val});
  }

  //receives json and sets headers and data
  configJSONData(self, file) {
    const headers = Object.keys(file[0]);
    self.setState({parsetData: file, headers});
  }

  //renders the actual parallel sets graph
  renderParset(data) {
    const {
      totalType,
      parsetData,
      headerCheckBoxes
    } = this.state;
    if (totalType != null) {
      return (
            <ParSet
              data={data}
              headers={headerCheckBoxes}
              totalType={totalType}
              test="Count"
            />
            )
    }
  }
  //catptures the change in text
  onChangeText(e) {
    this.setState({totalType: e.target.value});
  }

  //handles the changes when the checkboxes are checked
  onCheck(event, isChecked, self, e) {
    const {
      headerCheckBoxes,
      headers
    } = this.state
    var obj = Object.assign({}, headerCheckBoxes);
    obj[e] = isChecked;
    var keys = Object.keys(obj)
    var checkedHeaders = keys.filter(e => {
      if (obj[e] == false) {
        return e.trim()
      }
    });
    this.setState({headers: checkedHeaders, headerCheckBoxes: obj, parameterInput: JSON.stringify(checkedHeaders)});
  }

  //handles the change in data types between json and csv
  onDataTypeChange(self, val) {
    self.setState({ dataType: val });
  }

  //renders the headers
  renderHeaders(self) {
    const {
      headers
    } = self.state.queuedData;

    var optionArr = headers.map((e, i) => {
      return (
        <div key={i}>
          <Checkbox
            checked={self.state.headerCheckBoxes[e]}
            onCheck={(event, isChecked) => self.onCheck(event, isChecked, self, e)}
            label={e}
          />
        </div>
      )
    });
    if (optionArr.length == 0) {
      return (
        <div style={{marginTop: 10, marginBottom: 10}}>
          There are no Headers to choose from please try importing a new file!
        </div>
      );
    }else{
      return (
        <div style={{marginTop: 10, marginBottom: 10}}>
          <h4>Select the parameters you want to exclude</h4>
          {optionArr}
        </div>
      );
    }
  }

  //recieves and changes the state of totalType accordingly
  onRadioButtonGroupChange(event, value, self) {
    self.setState({totalType: value});
  }

  //renders all possible headers as radio buttons
  renderTotalSelector(self) {
    const {
      headers
    } = self.state.queuedData;
    var totalSelector = headers.map((e, i) => {
      return (
        <RadioButton
          label={e}
          value={e}
          key={i}
        />
      )
    });

    if (totalSelector.length == 0) {
      return (
        <div style={{marginTop: 10, marginBottom: 10}}>
          You cannot choose the total column yet.
        </div>
      );
    }
    return (
      <RadioButtonGroup
        onChange={(event, val) => self.onRadioButtonGroupChange(event, val, self)}
        name="totalColumn"
        style={{marginTop: 10, marginBottom: 10}}
        defaultSelected="None"
        valueSelected={self.state.totalType}
      >
        {totalSelector}
        <RadioButton
          label="None"
          value="None"
        />
      </RadioButtonGroup>
    )
  }

  //updates the state of open
  updateDidClick(self) {
    if (self) {
      self.setState({open: !self.state.open});
    }else{
      this.setState({open: !this.state.open});
    }
  }

  //sets parsetData to the queued data and open to false
  createGraph(self) {
    self.setState({open: false, parsetData: self.state.queuedData.data});
  }

  //sets the parameter input to a new value
  changeInputParameters(val) {
    if (this.state.parameterInput != "[]") {
      this.setState({parameterInput: val})
    }
  }

  //function to download the data
  downloadDataDidClicked(self) {
    if (self.state.url) {
      fileDownload(self.state.dataPath, 'data.txt');
    }else{
      fileDownload(JSON.stringify(self.state.parsetData), 'data.txt');
    }
  }

  //function to download the parameters
  downloadParameterDidClick(self) {
    const {
      totalType,
      headerCheckBoxes,
      url,
      dataType
    } = self.state;
    var headers = Object.keys(headerCheckBoxes).filter(e => {
      if (headerCheckBoxes[e] == false) {
        return e;
      }
    });
    const obj = {
      headers,
      totalType: totalType.trim(),
      url,
      dataType
    }
    var data = JSON.stringify(obj);
    fileDownload(data, 'parameters.txt');
  }

  //returns the parset chart
  renderComponents() {
    const {
      headers,
      rawParams,
      parameterInput
    } = this.state;

    return (
      <div>
        <Modal
          dataType={this.state.dataType}
          onDataTypeChange={this.onDataTypeChange}
          totalType={this.state.totalType}
          onChangeText={this.onChangeText}
          handleChange={this.handleChange}
          file={this.state.file}
          data={this.state.queuedData}
          disabled={this.state.disabled}
          renderComponents={this.createGraph}
          renderHeaders={this.renderHeaders}
          renderTotalSelector={this.renderTotalSelector}
          open={this.state.open}
          updateDidClick={this.updateDidClick}
          dataPath={this.state.dataPath}
          onDataPathChange={this.onDataPathChange}
          onDataPathBtnPressed={this.onDataPathBtnPressed}
          self={this}
        />
        <RaisedButton
          onClick={() => this.updateDidClick()}
          style={{marginLeft: 10, marginRight: 10}}
        >
          Open Modal
        </RaisedButton>
        <div>
          <h3>{rawParams.length == 0 ? "There are no parameters to select from" : "All of the possible parameters are " + JSON.stringify(rawParams)}</h3>
          <TextField
            hintText="Hint Text"
            value={this.state.parameterInput == "[]" ? "There are no parameters" : this.state.parameterInput}
            onChange={(e, val) => this.changeInputParameters(val)}
            style={{width: "80%", maxWidth: "900px"}}
          />
          <br />
          <h3><b>The applied parameters are:</b></h3>
          <h4>{headers.length == 0 ? "None" : JSON.stringify(headers)}</h4>
          <RaisedButton
            onClick={() => this.setHeaders()}
          >
            Change Parameters
          </RaisedButton>
        </div>
        {this.renderParset(this.state.parsetData)}
        <div>
          <Data
            value={this.state.url == false ? this.state.parsetData : this.state.dataPath}
            url={this.state.url}
            onClick={this.downloadDataDidClicked}
            self={this}
          />
          <Parameters
            headers={this.state.headers}
            totalType={this.state.totalType.trim()}
            url={this.state.url}
            dataType={this.state.dataType}
            self={this}
            onClick={this.downloadParameterDidClick}
          />
        </div>
      </div>
    )
  }

  setHeaders() {
    const {
      parameterInput,
      headerCheckBoxes
    } = this.state;
    const keys = Object.keys(headerCheckBoxes);
    var headerObj = {};
     keys.map(e => {
       if (parameterInput.includes(e)) {
         headerObj[e] = false;
       }else{
         headerObj[e] = true;
       }
     });
    this.setState({headers: JSON.parse(parameterInput), headerCheckBoxes: headerObj})
  }

  render() {
    const { error } = this.state;
    return (
      <div style={{flex: 1, alignItems: 'center'}}>
        <SelectionHeader />
        <h1 style={{color: "red", fontFamily: "Avenir Next"}}>{error == "" ? "" : `The error is ${error}`}</h1>
        {this.renderComponents()}
      </div>
    )
  }
}

const styles = {

};

export default ParallelSet;
