const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config();

const isManager = function (req, res, next) {
  User.findOne({ username: req.query.username }, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else if (user.role == "manager") {
      next();
      return;
    } else {
      res.status(403).send({ message: "Require Admin Role!" });
      return;
    }
  });
};

module.exports = isManager;
