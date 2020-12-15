import React from "react";
import { query } from "../../api/user";
import "./index.css";

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }
  async getList() {
    const res = await query();
    this.setState({
      users: res.result,
    });
  }
  componentDidMount() {
    this.getList();
  }
  render() {
    const { users } = this.state;
    return (
      <div className="users">
        <ul>
          {users.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
