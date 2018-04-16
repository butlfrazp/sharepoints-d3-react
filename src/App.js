import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from './components/Home';
import {
  Header
} from './components/common';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.test();
  }

  test() {
    return "test";
  }

    render() {
      const {
        app
      } = styles;
        return (
          <MuiThemeProvider>
            <div style={ app }>
              <Home />
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
