import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';

const Modal = props => {
  const {
    container
  } = styles;

  return (
    <Dialog
      title="Create New Chart"
      autoScrollBodyContent={true}
      modal={true}
      open={props.open}
    >
      <div style={container}>
        <div>
          <RaisedButton
             containerElement='label' // <-- Just add me!
             label='My Label'>
             <input type="file" value={props.file} onChange={e => props.handleChange(e.target.files, props.self)}/>
          </RaisedButton>
        </div>
        <br/>
        <h3>or</h3>
        <div>
          <TextField
            id="data-path"
            hintText="https://analytics.asu.edu"
            value={props.dataPath}
            onChange={(event, val) => props.onDataPathChange(props.self, val)}
          />
          <RaisedButton
            onClick={() => props.onDataPathBtnPressed(props.self)}
          >
            Try Path!
          </RaisedButton>
        </div>
        <div>
          <h3>Chart Columns</h3>
          {props.renderHeaders(props.self)}
          <h3>Total Column</h3>
          {props.renderTotalSelector(props.self)}
        </div>
        <RaisedButton
          onClick={() => props.updateDidClick(props.self)}
        >
          Close
        </RaisedButton>
        <RaisedButton
          disabled={props.disabled}
          onClick={() => props.renderComponents(props.self)}
        >
          Submit
        </RaisedButton>
      </div>
    </Dialog>
  )
}

const styles = {
  container: {

  }
}

export { Modal };
