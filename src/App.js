import React, { Component } from "react";

const styles = {
    app: {
        fontFamily: "Roboto, Sans-serif",
        border: "1px solid #eee",
        borderRadius: "5px",
        padding: "15px",
        textAlign: "center",
    }
}

export default class App extends Component {
    render() {
        return (
            <div style={ styles.app }>
                <div>Hello World</div>
                <div>To begin, start by editing <code>/src/App.js</code> in the project's root directory</div>
            </div>
        )
    }
}