const { validateUrl } = require("../config");

const { MongoClient, ObjectId } = require("mongodb");
const { dbname, dburl } = require("../db/config");

const getClient = () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(dburl, function (err, client) {
      if (err) {
        reject(err);
      }
      console.log("database connect");
      let db;
      db = client.db(dbname);
      resolve(db);
    });
  });

exports.getDB = async (req, res, next) => {
  const db = await getClient();
  req.db = db;
  next();
};

exports.checkLogin = async (name, password, done) => {
  const db = await getClient();
  const user = await db.collection("user").findOne({ name, password });
  if (!user) {
    return done(null, false, { message: "Incorrect name or password" });
  }
  return done(null, user);
};

exports.checkStatus = async (req, res, next) => {
  const { session, path } = req;
  // need to check loginedStatus
  if (validateUrl.includes(path)) {
    const { name } = req.session;
    const res1 = await req.db
      .collection("user")
      .findOne({ _id: ObjectId(name) });
    if (!name || !res1) {
      res.status(401);
      res.json({
        code: 401,
      });
    } else {
      next();
    }
  } else {
    next();
  }
};
