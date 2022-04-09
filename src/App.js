import './App.css';
import React, {Component} from "react";
import { BrowserRouter as Router } from "react-router-dom";


import Context from "./Context";
import NavBar from "./components/NavBar";
import withAuthentication from "./components/Session/withAuthentication";
import {ToastContainer} from "react-toastify";

class App extends Component {
  constructor(props) {
    super(props);
    this.routerRef = React.createRef();
  };

  render() {
    return <Context.Provider value={{
    ...this.state
    }}>
      <Router ref={this.routerRef}>
        <NavBar />
        <ToastContainer />
      </Router>
    </Context.Provider>
  }
}

export default withAuthentication(App);
