const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", (req, res) => {
  User.find().then((result) => {
    console.log(result);
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  User.find({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.json(result);
  });
});
router.get("/userId/:userId", (req, res) => {
  User.find({ userId: req.params.userId }).then((result) => {
    console.log(result);
    res.json(result);
  });
});
module.exports = router;
