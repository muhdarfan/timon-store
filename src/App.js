import logo from './logo.svg';
import './App.css';
import React, {Component} from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Product from "./components/Product";
import Login from "./components/admin/Login";

import Context from "./Context";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user : null,
      products: []
    };
    this.routerRef = React.createRef();
  };


  render() {
    return <Context.Provider value={{
    ...this.state
    }}>
      <Router ref={this.routerRef}>
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start"  color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                News
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>

          <Switch>
            <Route exact path="/" component={Product} />
            <Route exact path="/admin" component={Login} />
          </Switch>
        </div>
      </Router>
    </Context.Provider>
  }
}

export default App;
