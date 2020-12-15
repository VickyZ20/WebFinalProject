const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  const db = req.db;
  const { page, datesort, pricesort, roomNum } = req.query;
  let handle = db.collection("h");
  let rmnum = null;
  if (roomNum) {
    let obj = {
      $or: [],
    };
    rmnum = roomNum.split(",");
    rmnum.forEach((ite) => {
      obj["$or"].push({
        roomNum: Number(ite),
      });
    });
    handle = handle.find(obj);
  } else {
    handle = handle.find();
  }

  if (datesort === "1") {
    handle = handle.sort({ date: 1 });
  }
  if (datesort === "-1") {
    handle = handle.sort({ date: -1 });
  }
  if (pricesort === "1") {
    handle = handle.sort({ rprice: 1 });
  }
  if (pricesort === "-1") {
    handle = handle.sort({ rprice: -1 });
  }
  const res1 = await handle
    .skip(20 * (page - 1))
    .limit(20)
    .toArray();
  if (res1) {
    res.json({
      result: res1,
      code: 200,
    });
  } else {
    res.json({
      code: -1,
      message: "wrong",
    });
  }
});

router.get("/query", async (req, res) => {
  const res1 = await req.db.collection("h").findOne({
    _id: ObjectId(req.query.id),
  });
  res.json({
    result: res1,
    code: 200,
  });
});

router.post("/diss", async (req, res) => {
  const { db, session } = req;
  const { id, content } = req.body;
  const { name: username } = await db.collection("user").findOne({
    _id: ObjectId(session.name),
  });
  const doc = await db.collection("h").findOne({ _id: ObjectId(id) });
  let { comments } = doc;
  comments = [
    {
      _id: ObjectId(),
      createTime: new Date().toLocaleString(),
      userid: session.name,
      username,
      content,
    },
    ...comments,
  ];
  await db
    .collection("h")
    .updateOne({ _id: ObjectId(id) }, { $set: { comments } });
  res.json({
    code: 200,
  });
});

router.get("/removeComm", async (req, res) => {
  const { db, query, session } = req;
  const hid = ObjectId(query.hid);
  const doc = await db.collection("h").findOne({ _id: hid });
  let { comments } = doc;
  let index = comments.findIndex((item) => String(item._id) === query._id);
  if (comments[index].userid === session.name) {
    comments.splice(index, 1);
    await db.collection("h").updateOne({ _id: hid }, { $set: { comments } });
    res.json({
      code: 200,
    });
  } else {
    res.json({
      code: -1,
      message: "can't remove other diss",
    });
  }
});

router.post("/edit", async (req, res) => {
  const { db, session } = req;
  const { hid: house_id, _id, content } = req.body;
  const hid = ObjectId(house_id);

  const doc = await db.collection("h").findOne({ _id: hid });

  let { comments } = doc;
  let comm = comments.find((item) => String(item._id) === _id);
  if (comm.userid === session.name) {
    comm.content = content;
    await db.collection("h").updateOne({ _id: hid }, { $set: { comments } });
    res.json({
      code: 200,
    });
  } else {
    res.json({
      code: -1,
      message: "can't remove other diss",
    });
  }
});

module.exports = router;
