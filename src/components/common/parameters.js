import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const Parameters = props => {
  //props = headers, totalType, url, dataType
  const {
    headers,
    totalType,
    url,
    dataType,
    self,
    onClick
  } = props;
  const {
    contentContainer,
    textStyle,
    headerTextStyle
  } = styles;
  return (
    <div>
      <h1 style={headerTextStyle}>Parameters</h1>
      <div style={contentContainer}>
        <p style={textStyle}>Headers: <b>{props.headers.length == 0 ? "There are no headers" : JSON.stringify(props.headers)}</b></p>
        <p style={textStyle}>Total Type: <b>{props.totalType}</b></p>
        <p style={textStyle}>URL: <b>{props.url == "" ? "None" : "Yes"}</b></p>
        <p style={textStyle}>Data Type: <b>{props.dataType}</b></p>
      </div>
      <div>
        <RaisedButton
          style={{paddingLeft: 10, paddingRight: 10}}
          onClick={() => onClick(self)}
        >
          Download Parameters
        </RaisedButton>
      </div>
    </div>
  )
}

const styles = {
  contentContainer: {
    textAlign: "left",
    width: "1200px",
    margin: "auto"
  },
  textStyle: {
    fontSize: "18px",
    fontFamily: "Avenir Next",
  },
  headerTextStyle: {
    fontSize: "24px",
    fontFamily: "Avenir Next",
  }
}

export {Parameters}
