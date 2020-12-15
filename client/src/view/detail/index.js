import React from "react";
import { query, diss, removeComm, edit } from "../../api/house";
import { Link } from "react-router-dom";
import "./index.css";

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.swiperref = React.createRef();
    this.state = {
      id: null,
      info: {},
      fold: false,
      commentText: "",
    };
  }
  initSwiper() {
    const Swiper = window.Swiper;
    this.swiper = new Swiper(".swiper-container", {
      width: 800,
      allowSlideNext: true,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
    });
  }
  async getDetail() {
    const res = await query({ id: this.state.id });
    if (res.code === 200) {
      await this.setState({
        info: res.result,
      });
      this.initSwiper();
    }
  }
  colls() {
    const { fold } = this.state;
    this.setState({
      fold: !fold,
    });
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    await this.setState({
      id,
    });
    this.getDetail();
  }
  setValue(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }
  async publishDiss(e) {
    e.preventDefault();
    const { commentText, id } = this.state;
    const res = await diss({ content: commentText, id });
    if (res.code === 200) {
      this.setState({
        commentText: "",
      });
      this.getDetail();
    }
    if (res.code === 401) {
      this.props.history.push({ pathname: "/login" });
    }
  }
  async removeComm(row) {
    const res = await removeComm({ _id: row._id, hid: this.state.id });
    if (res.code === 200) {
      this.getDetail();
    }
    if (res.code === 401) {
      this.props.history.push({ pathname: "/login" });
    }
  }
  async editComm(row) {
    const res = await edit({
      _id: row._id,
      hid: this.state.id,
      content: row.content,
    });
    if (res.code === 200) {
      this.getDetail();
    }
    if (res.code === 401) {
      this.props.history.push({ pathname: "/login" });
    }
  }
  setItem(e, row, index) {
    const { info } = this.state;
    let list = info.comments;
    row.content = e.target.value;
    list[index] = row;
    let obj = Object.assign(info, { comments: list });
    this.setState({
      info: obj,
    });
  }
  render() {
    const { info, fold, commentText } = this.state;
    const logined = localStorage.getItem("logined");
    return (
      <div className="detail">
        <div className="swiper-container" ref={this.swiperref}>
          <div className="swiper-wrapper">
            {info.imgList &&
              info.imgList.map((ite) => (
                <div key={ite} className="swiper-slide">
                  <img src={ite} alt="" />
                </div>
              ))}
          </div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
        <div className="house-info">
          <p className="price">Rent: ${info.rprice}/month</p>
          <p className="house-type">{info.housing}</p>
          <p className="title">{info.titletextonly}</p>
          <p className="add">Address: {info.mapaddress}</p>
          <div className={`content ${fold ? "fold" : ""}`}>
            <p
              className=""
              dangerouslySetInnerHTML={{ __html: info.postingbody }}
            ></p>
            <span onClick={(e) => this.colls(e)}>
              {fold ? "Click to see less" : "Click to see more"}
            </span>
          </div>
        </div>
        <div className="comments">
          <div className="publish">
            {logined ? (
              <form>
                <label>
                  <textarea
                    name="commentText"
                    rows="4"
                    onChange={(e) => this.setValue(e)}
                    placeholder="Enter comment or note"
                    value={commentText}
                  />
                </label>
                <label>
                  <button onClick={(e) => this.publishDiss(e)}>
                    Add Comment
                  </button>
                </label>
              </form>
            ) : (
              <p style={{ textAlign: "center" }}>
                To add comments/notes, please <Link to="/login">login</Link>
              </p>
            )}
          </div>
          <h4 style={{ margin: "0 12px" }}>User Comments & Notes</h4>
          <ul className="comm-wrapper">
            {info.comments &&
              info.comments.map((item, index) => (
                <li key={item._id} className="comm-item">
                  <div>
                    <em className="username">{item.username}: </em>
                    {logined === item.userid ? (
                      <textarea
                        onChange={(e) => this.setItem(e, item, index)}
                        value={item.content}
                      />
                    ) : (
                      item.content
                    )}
                    <p className="create-time">{item.createTime}</p>
                  </div>

                  {logined === item.userid && (
                    <div className="btns">
                      <button onClick={(e) => this.editComm(item)}>Edit</button>
                      <button onClick={(e) => this.removeComm(item)}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
