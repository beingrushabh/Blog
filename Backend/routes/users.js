const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", (req, res) => {
  User.find().then((result) => {
    console.log(result);
    res.json(result);
  });
});
module.exports = router;
