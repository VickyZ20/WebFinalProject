import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { login } from "../../api/user";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
    };
  }

  setValue(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }
  async login(e) {
    e.preventDefault();
    const { name, password } = this.state;
    if (!name || !password) {
      return alert("please input username and password");
    }
    const res = await login({ name, password });
    if (res.code !== 200) {
      return;
    }
    localStorage.setItem("logined", res.uid);
    this.props.history.push({ pathname: "/" });
  }
  render() {
    const { name, password } = this.state;
    return (
      <div className="login">
        <div className="wrapper">
          <h3>Login</h3>
          <form>
            <label>
              <input
                name="name"
                onInput={(e) => this.setValue(e)}
                value={name}
                type="text"
                placeholder="Enter username"
              />
            </label>
            <label>
              <input
                name="password"
                onInput={(e) => this.setValue(e)}
                value={password}
                type="password"
                placeholder="Enter password"
              />
            </label>
            <label className="oper">
              <button onClick={(e) => this.login(e)}>Sign In</button>
              <p>
                New User？<Link to="registry">Sign Up Now</Link>
              </p>
            </label>
          </form>
        </div>
      </div>
    );
  }
}
