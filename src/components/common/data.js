import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const Data = props =>  {
  const {
    headerStyle,
    dataContainerView,
    textStyle
  } = styles;
  return (
    <div>
      <h3 style={headerStyle}>Data</h3>
      <div style={{alignItems: 'center', margin: 10}}>
        <RaisedButton
          onClick={() => props.onClick(props.self)}
          style={{paddingLeft: 10, paddingRight: 10}}
        >
          Download Data
        </RaisedButton>
      </div>
    </div>
  );
}

const styles = {
  headerStyle: {
    fontSize: "24px",
    fontFamily: "Avenir Next"
  },
  textStyle: {
    fontFamily: "12px",
    fontFamily: "Avenir Next",
  },
  dataContainerView: {
    textAlign: "left",
    marginLeft: 20,
    marginRight: 20
  }
}

export {Data};
