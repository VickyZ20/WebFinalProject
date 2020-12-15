import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Login from "./view/login";
import Registry from "./view/registry";
import Home from "./view/index";
import Detail from "./view/detail";
import User from "./view/user";

import reportWebVitals from "./reportWebVitals";

import { Route, BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/registry" component={Registry} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/user" component={User} />
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
