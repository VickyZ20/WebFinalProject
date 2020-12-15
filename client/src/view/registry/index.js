import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { register } from "../../api/user";

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
    const res = await register({ name, password });
    if (res.code !== 200) {
      return;
    }
    this.props.history.push("/login");
  }
  render() {
    const { name, password } = this.state;
    return (
      <div className="login">
        <div className="wrapper">
          <h3>Sign Up</h3>
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
              <button onClick={(e) => this.login(e)}>Sign Up Now</button>
              <p>
                Already a user？<Link to="login">Sign In</Link>
              </p>
            </label>
          </form>
        </div>
      </div>
    );
  }
}
