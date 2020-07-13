const express = require("express");
const router = express.Router();

const session = require("../models/sessions.js");

router.get("/:id", (req, res) => {
  session.find({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.json(result);
  });
});
