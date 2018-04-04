import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ParallelSet from './components/parallelSet';
import {
  Header
} from './components/common';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
    render() {
      const {
        app
      } = styles;
        return (
          <MuiThemeProvider>
            <div style={ app }>
              <Header />
              <ParallelSet />
            </div>
          </MuiThemeProvider>
        )
    }
}

const styles = {
  app: {
    fontFamily: "Roboto, Sans-serif",
    textAlign: "center",
  }
}
