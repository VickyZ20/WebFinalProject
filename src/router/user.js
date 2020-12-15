const { response } = require("express");
const express = require("express");
const router = express.Router();
var passport = require("passport");

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err);
      return;
    }
    if (!user) {
      return res.json({
        code: -1,
        message: "Incorrect name or password",
      });
    }

    req.session.name = user._id;
    res.json({
      code: 200,
      uid: user._id,
      message: "Success",
    });
  })(req, res, next);
});
router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const db = req.db;
  const res1 = await db.collection("user").findOne({ name });
  if (!res1) {
    await db.collection("user").insertOne({
      name,
      password,
    });
    return res.json({
      code: 200,
      message: "success",
    });
  }
  res.json({
    code: -1,
    message: "fail: username already exist",
  });
});

router.get("/", async (req, res) => {
  const db = req.db;
  const res1 = await db
    .collection("user")
    .find({})
    .project({ name: 1 })
    .toArray();
  res.json({
    code: 200,
    result: res1,
  });
});

module.exports = router;
