const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commentId: String,
  comment: String,
  user: String,
});
CommentSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
CommentSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Comment", CommentSchema);
