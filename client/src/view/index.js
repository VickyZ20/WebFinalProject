import React from "react";
import { getList } from "../api/house";
import "./index.css";
import { Link } from "react-router-dom";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      list: [],
      datesort: "0",
      pricesort: "0",
      roomNum: [],
      loading: false,
    };
  }
  componentDidMount() {
    this._getList();
  }
  async _getList() {
    const { page, datesort, pricesort, roomNum } = this.state;
    const res = await getList({ page, datesort, pricesort, roomNum });
    const { list } = this.state;
    this.setState({
      list: [...list, ...res.result],
    });
  }
  setValue(e) {
    if (e.target.name === "roomNum") {
      const eles = document.getElementsByName("roomNum");
      this.setState({
        roomNum: Array.from(eles)
          .filter((item) => item.checked)
          .map((ite) => ite.value)
          .join(","),
      });
      return;
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  async query(e) {
    e.preventDefault();
    await this.setState({
      list: [],
    });
    this._getList();
  }
  async loadMore() {
    try {
      const { page } = this.state;
      await this.setState({
        loading: true,
        page: page + 1,
      });
      this._getList();
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }
  render() {
    const { list, datesort, pricesort, loading } = this.state;
    return (
      <div className="home">
        <Link className="allusers" to={`/user`}>
          Users List
        </Link>
        <form className="oper">
          <label>
            sort by post time &nbsp;
            <select
              name="datesort"
              value={datesort}
              onChange={(e) => this.setValue(e)}
            >
              <option value="0" label="default" />
              <option value="1" label="recent to oldest" />
              <option value="-1" label="oldest to recent" />
            </select>
          </label>
          <label>
            sort by price &nbsp;
            <select
              name="pricesort"
              value={pricesort}
              onChange={(e) => this.setValue(e)}
            >
              <option value="0" label="default" />
              <option value="1" label="price low to high" />
              <option value="-1" label="price high to low" />
            </select>
          </label>
          <label>
            filter by number of bedrooms
            <label>
              1&nbsp;
              <input
                name="roomNum"
                value="1"
                type="checkbox"
                onChange={(e) => this.setValue(e)}
              />
            </label>
            <label>
              2&nbsp;
              <input
                name="roomNum"
                value="2"
                type="checkbox"
                onChange={(e) => this.setValue(e)}
              />
            </label>
            <label>
              3&nbsp;
              <input
                name="roomNum"
                value="3"
                type="checkbox"
                onChange={(e) => this.setValue(e)}
              />
            </label>
          </label>

          <label>
            <button onClick={(e) => this.query(e)}>Filter</button>
          </label>
        </form>
        <ul className="wrap">
          {list.map((item) => (
            <li key={item._id} className="item">
              <Link to={`/detail/${item._id}`}>
                <img src={item.imgList[0]} alt={item.titletextonly} />
                <p className="h-title">{item.titletextonly}</p>
                <p className="roomNum">{item.roomNum || ""} BR</p>
                <p className="h-info">
                  <span className="h-price">${item.rprice}</span>
                  <span className="h-date">{item["result-date"]}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <button className="load" onClick={(e) => this.loadMore(e)}>
          {loading ? "please wait for while, loading" : "Load More"}
        </button>
      </div>
    );
  }
}
