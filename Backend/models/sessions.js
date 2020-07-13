const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  expires: {
    type: Schema.Types.Date,
    required: true,
  },
  session: {
    type: Schema.Types.String,
    required: true,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
