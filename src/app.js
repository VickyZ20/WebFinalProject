const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const history = require("connect-history-api-fallback");
const { checkStatus, getDB, checkLogin } = require("./middleware");

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const app = express();
const user = require("./router/user");
const house = require("./router/house");
app.use(bodyParser.json());
app.use(
  expressSession({
    secret: "keyboard_cat",
    name: "uid",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password",
    },
    checkLogin
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(getDB);

app.use(checkStatus);

app.use("/user", user);
app.use("/house", house);

app.use(history());
app.use(express.static(path.join(__dirname, "../client/build")));

app.listen(process.env.PORT || 3001, () => {
  console.log("starting port 3001");
});
